import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { pm25ToIspu, rollingMean, ispuCategory } from "@/lib/ispu";
import { angularDiff, bearingDeg, compassName, destination, haversineKm, nearest } from "@/lib/geo";
import { deriveStatusTimeline, evaluateSchoolStatus, forecastSchoolDay } from "@/lib/school-status";
import { coneDrift, driftSentence, simulateDrift } from "@/lib/drift";
import { acqToUtcIso, clusterHotspots, normalizeRow, parseConfidence, formatLocalTime } from "@/lib/hotspots";
import { classifyEvidence, sha256Hex } from "@/lib/evidence";
import { appendDecision, verifyChain } from "@/lib/audit";
import { CITIES } from "@/config/cities";

describe("pm25ToIspu", () => {
  it.each([
    [0, 0, "BAIK"], [15.5, 50, "BAIK"], [15.6, 51, "SEDANG"], [55.4, 100, "SEDANG"],
    [55.5, 101, "TIDAK_SEHAT"], [150.4, 200, "TIDAK_SEHAT"], [150.5, 201, "SANGAT_TIDAK_SEHAT"],
    [250.4, 300, "SANGAT_TIDAK_SEHAT"], [250.5, 301, "BERBAHAYA"], [500, 500, "BERBAHAYA"],
  ])("%s µg/m³ -> %s (%s)", (c, v, cat) => {
    const r = pm25ToIspu(c)!;
    expect(r.value).toBe(v);
    expect(r.category).toBe(cat);
  });
  it("closes the 15.5–15.6 gap by rounding", () => expect(pm25ToIspu(15.55)!.category).toBe("SEDANG"));
  it("caps above 500", () => expect(pm25ToIspu(812)).toMatchObject({ value: 500, capped: true }));
  it("rejects invalid", () => {
    expect(pm25ToIspu(-1)).toBeNull();
    expect(pm25ToIspu(NaN)).toBeNull();
    expect(pm25ToIspu(null)).toBeNull();
  });
  it("is monotonic non-decreasing (property)", () =>
    fc.assert(fc.property(fc.double({ min: 0, max: 600, noNaN: true }), fc.double({ min: 0, max: 600, noNaN: true }), (a, b) => {
      const [lo, hi] = a <= b ? [a, b] : [b, a];
      return pm25ToIspu(lo)!.value <= pm25ToIspu(hi)!.value;
    })));
  it("category of value agrees with category of concentration (property)", () =>
    fc.assert(fc.property(fc.double({ min: 0, max: 500, noNaN: true }), (c) => {
      const r = pm25ToIspu(c)!;
      return ispuCategory(r.value) === r.category;
    })));
  it("rollingMean needs enough valid values", () => {
    expect(rollingMean([1, null, 3], 3, 2)).toEqual([null, null, 2]);
  });
});

describe("geo", () => {
  const pku = CITIES[0];
  it("haversine Pekanbaru–Jambi ≈ 260 km", () => expect(haversineKm(pku, CITIES[2])).toBeGreaterThan(240));
  it("bearing due east ≈ 90", () => expect(bearingDeg({ lat: 0, lon: 100 }, { lat: 0, lon: 101 })).toBeCloseTo(90, 3));
  it("destination round-trips with haversine (property)", () =>
    fc.assert(fc.property(fc.double({ min: 0, max: 359.9, noNaN: true }), fc.double({ min: 1, max: 400, noNaN: true }), (b, km) => {
      const p = destination(pku, b, km);
      return Math.abs(haversineKm(pku, p) - km) < 0.5;
    })));
  it("angularDiff wraps", () => {
    expect(angularDiff(350, 10)).toBe(20);
    expect(angularDiff(10, 350)).toBe(20);
    expect(angularDiff(0, 180)).toBe(180);
  });
  it("compass names", () => {
    expect(compassName(0)).toBe("utara");
    expect(compassName(44)).toBe("timur laut");
    expect(compassName(359)).toBe("utara");
    expect(compassName(225)).toBe("barat daya");
  });
  it("nearest city", () => expect(nearest({ lat: 0.4, lon: 101.5 }, CITIES).item.id).toBe("pekanbaru"));
});

describe("school status (rules + hysteresis)", () => {
  const level = (s: (number | null)[]) => deriveStatusTimeline(s).map((x) => x.level);
  it("Waspada immediately above 100", () => expect(evaluateSchoolStatus([90, 101]).code).toBe("WASPADA"));
  it("exactly 100 is not Waspada", () => expect(evaluateSchoolStatus([100]).code).toBe("NORMAL"));
  it("Hybrid needs 3 consecutive hours > 150", () => expect(level([151, 151, 151])).toEqual([1, 1, 2]));
  it("Daring needs 2 consecutive hours > 200", () => expect(level([201, 201])).toEqual([1, 3]));
  it("single spike does not reach Daring", () => expect(level([120, 250, 120])).toEqual([1, 1, 1]));
  it("hysteresis: holds 2 hours, steps down on 3rd", () => expect(level([201, 201, 90, 90, 90])).toEqual([1, 3, 3, 3, 0]));
  it("hysteresis counter resets on relapse", () => expect(level([201, 201, 90, 90, 210, 90, 90, 90])).toEqual([1, 3, 3, 3, 3, 3, 3, 0]));
  it("steps down to intermediate level", () => expect(level([201, 201, 180, 180, 180])).toEqual([1, 3, 3, 3, 2]));
  it("missing data never escalates and never counts down", () => {
    expect(level([201, null, 201])).toEqual([1, 1, 1]);
    expect(level([201, 201, 90, null, 90, 90])).toEqual([1, 3, 3, 3, 3, 0]);
  });
  it("vulnerable mode lowers thresholds by 50", () => expect(evaluateSchoolStatus([60], true).code).toBe("WASPADA"));
  it("reason mentions values", () => expect(evaluateSchoolStatus([201, 205]).reason).toContain("205"));
  it("every step-down is preceded by 3 valid calm hours (property)", () =>
    fc.assert(fc.property(fc.array(fc.option(fc.integer({ min: 0, max: 400 }), { nil: null }), { maxLength: 48 }), (s) => {
      const thr = [Infinity, 100, 150, 200];
      const tl = deriveStatusTimeline(s);
      for (let i = 1; i < tl.length; i++) {
        if (tl[i].level < tl[i - 1].level) {
          const calm = s.slice(0, i + 1).filter((v): v is number => v != null).slice(-3);
          if (s[i] == null || calm.length < 3 || calm.some((v) => v > thr[tl[i - 1].level])) return false;
        }
      }
      return true;
    })));
  it("forecast for tomorrow uses school hours only", () => {
    const pts = Array.from({ length: 24 }, (_, h) => ({ time: `2026-10-22T${String(h).padStart(2, "0")}:00`, value: h >= 15 ? 260 : 80 }));
    expect(forecastSchoolDay(pts, "2026-10-22")!.status.code).toBe("NORMAL");
    const smokyMorning = pts.map((p, h) => ({ ...p, value: h >= 4 && h <= 9 ? 230 : 80 }));
    const r = forecastSchoolDay(smokyMorning, "2026-10-22")!;
    expect(r.status.code).toBe("DARING_DARURAT");
    expect(r.peakIspu).toBe(230);
  });
});

describe("smoke drift", () => {
  const jambi = CITIES.find((c) => c.id === "jambi")!;
  const pku = CITIES.find((c) => c.id === "pekanbaru")!;
  // Fire 100 km south-east of Pekanbaru; wind FROM south-east (135°) blows smoke north-west.
  const fire = destination(pku, 135, 100);
  it("hits downwind city; ETA = plume edge arrival, before centre arrival (distance / speed)", () => {
    const r = simulateDrift(fire, [{ windFromDeg: 135, windKmh: 20 }], CITIES);
    const hit = r.find((x) => x.cityId === "pekanbaru")!;
    expect(hit).toBeDefined();
    expect(hit.distanceKm).toBe(100);
    expect(hit.etaHours).toBeGreaterThan(3);
    expect(hit.etaHours).toBeLessThanOrEqual(5);
  });
  it("ignores upwind city", () => {
    const r = simulateDrift(fire, [{ windFromDeg: 315, windKmh: 20 }], [pku]);
    expect(r).toHaveLength(0);
  });
  it("calm wind produces no far ETA", () => {
    expect(simulateDrift(fire, [{ windFromDeg: 135, windKmh: 1 }], [pku])).toHaveLength(0);
  });
  it("wind shift changes the target", () => {
    const shifting = [{ windFromDeg: 135, windKmh: 20 }, { windFromDeg: 135, windKmh: 20 }, ...Array(22).fill({ windFromDeg: 45, windKmh: 20 })];
    const r = simulateDrift(fire, shifting, [pku, jambi]);
    expect(r.find((x) => x.cityId === "pekanbaru")).toBeUndefined();
  });
  it("legacy cone matches spec", () => {
    const c = coneDrift(fire, pku, 135, 20);
    expect(c.affected).toBe(true);
    expect(c.etaHours!).toBeCloseTo(5, 0);
    expect(coneDrift(fire, pku, 315, 20).affected).toBe(false);
  });
  it("Indonesian sentence uses comma decimals", () => {
    const s = driftSentence({ windFromDeg: 45, windKmh: 15, sourceNear: "Jambi", sourceKm: 42, city: "Pekanbaru", etaHours: 3.5 });
    expect(s).toContain("timur laut");
    expect(s).toContain("3,5 jam");
  });
});

describe("hotspots", () => {
  it("confidence mapping", () => {
    expect(parseConfidence("h")).toBe("TINGGI");
    expect(parseConfidence("n")).toBe("SEDANG");
    expect(parseConfidence(25)).toBe("RENDAH");
    expect(parseConfidence("x")).toBeNull();
  });
  it("acq time to UTC", () => {
    expect(acqToUtcIso("2026-10-21", "547")).toBe("2026-10-21T05:47:00Z");
    expect(acqToUtcIso("bad", "0547")).toBeNull();
  });
  it("WITA vs WIB display", () => {
    expect(formatLocalTime("2026-10-21T05:47:00Z", "Asia/Jakarta", "WIB")).toBe("12.47 WIB");
    expect(formatLocalTime("2026-10-21T05:47:00Z", "Asia/Makassar", "WITA")).toBe("13.47 WITA");
  });
  it("normalizes and clusters duplicates across satellites", () => {
    const rows = [
      { latitude: "-1.501", longitude: "103.501", acq_date: "2026-10-21", acq_time: "0547", confidence: "n", frp: "12.3" },
      { latitude: "-1.502", longitude: "103.503", acq_date: "2026-10-21", acq_time: "0640", confidence: "h", frp: "30.1" },
      { latitude: "-2.900", longitude: "104.000", acq_date: "2026-10-21", acq_time: "0547", confidence: "l", frp: "3" },
      { latitude: "x", longitude: "1", acq_date: "2026-10-21", acq_time: "0547", confidence: "l", frp: "3" },
    ];
    const pts = rows.map((r, i) => normalizeRow(r, i ? "NOAA20" : "SNPP")).filter((p) => p !== null);
    expect(pts).toHaveLength(3);
    const cl = clusterHotspots(pts);
    expect(cl).toHaveLength(2);
    expect(cl[0]).toMatchObject({ count: 2, maxFrp: 30.1, confidence: "TINGGI", latestUtc: "2026-10-21T06:40:00Z" });
  });
});

describe("evidence", () => {
  const city = CITIES[0];
  const now = new Date("2026-10-21T10:00:00Z");
  const near = destination(city, 0, 5);
  it("verified when fresh and near", () => expect(classifyEvidence({ takenAt: new Date("2026-10-21T08:00:00Z"), gps: near }, city, now).status).toBe("TERVERIFIKASI"));
  it("partial when GPS missing", () => expect(classifyEvidence({ takenAt: new Date("2026-10-21T08:00:00Z") }, city, now).status).toBe("SEBAGIAN"));
  it("partial when time missing", () => expect(classifyEvidence({ gps: near }, city, now).status).toBe("SEBAGIAN"));
  it("unverified when nothing", () => expect(classifyEvidence({}, city, now).status).toBe("BELUM_TERVERIFIKASI"));
  it("mismatch when too old", () => expect(classifyEvidence({ takenAt: new Date("2026-10-19T08:00:00Z"), gps: near }, city, now).status).toBe("TIDAK_SESUAI"));
  it("mismatch when too far", () => expect(classifyEvidence({ takenAt: new Date("2026-10-21T08:00:00Z"), gps: destination(city, 90, 120) }, city, now).status).toBe("TIDAK_SESUAI"));
  it("mismatch when in the future", () => expect(classifyEvidence({ takenAt: new Date("2026-10-21T12:00:00Z"), gps: near }, city, now).status).toBe("TIDAK_SESUAI"));
  it("null island GPS (0,0) is treated as missing", () => expect(classifyEvidence({ gps: { lat: 0, lon: 0 } }, city, now).status).toBe("BELUM_TERVERIFIKASI"));
  it("sha256 known vector", async () => expect(await sha256Hex(new TextEncoder().encode("abc"))).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"));
});

describe("audit hash chain", () => {
  it("detects tampering", async () => {
    let log = await appendDecision([], { at: "2026-10-21T01:00:00Z", cityId: "jambi", school: "SDN 1", ispu: 230, recommended: "DARING_DARURAT", decided: "DARING_DARURAT", approver: "Kepsek" });
    log = await appendDecision(log, { at: "2026-10-21T05:00:00Z", cityId: "jambi", school: "SDN 1", ispu: 140, recommended: "WASPADA", decided: "HYBRID", approver: "Kepsek", note: "override" });
    expect(await verifyChain(log)).toBe(-1);
    const tampered = log.map((e, i) => (i === 0 ? { ...e, ispu: 90 } : e));
    expect(await verifyChain(tampered)).toBe(0);
  });
});
