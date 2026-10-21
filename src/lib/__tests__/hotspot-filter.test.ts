import { describe, it, expect } from "vitest";
import { filterClusters } from "@/lib/hotspot-filter";
import type { RichCluster } from "@/types/api";

const makeCluster = (overrides: Partial<RichCluster> = {}): RichCluster => ({
  id: "test",
  lat: 0.5, lon: 101.4,
  count: 3, maxFrp: 50, sumFrp: 120,
  confidence: "TINGGI",
  latestUtc: "2026-10-21T05:00:00Z",
  satellites: ["N21"],
  nearestCityId: "pekanbaru",
  nearestKm: 30,
  regionId: "riau",
  drift: [{ cityId: "pekanbaru", etaHours: 3, distanceKm: 30 }],
  ...overrides,
});

describe("filterClusters", () => {
  it("filters by region", () => {
    const clusters = [makeCluster({ regionId: "riau" }), makeCluster({ regionId: "kalteng" })];
    expect(filterClusters(clusters, { region: "riau" })).toHaveLength(1);
  });

  it("filters by confidence (TINGGI only)", () => {
    const clusters = [makeCluster({ confidence: "TINGGI" }), makeCluster({ confidence: "RENDAH" })];
    expect(filterClusters(clusters, { confidence: "TINGGI" })).toHaveLength(1);
  });

  it("sorts by FRP descending by default", () => {
    const clusters = [makeCluster({ maxFrp: 10 }), makeCluster({ maxFrp: 100 }), makeCluster({ maxFrp: 50 })];
    const result = filterClusters(clusters);
    expect(result[0].maxFrp).toBe(100);
  });

  it("sorts by ETA ascending", () => {
    const clusters = [
      makeCluster({ drift: [{ cityId: "pekanbaru", etaHours: 8, distanceKm: 80 }] }),
      makeCluster({ drift: [{ cityId: "pekanbaru", etaHours: 2, distanceKm: 20 }] }),
    ];
    const result = filterClusters(clusters, { sort: "eta", fromCityId: "pekanbaru" });
    expect(result[0].drift[0].etaHours).toBe(2);
  });
});
