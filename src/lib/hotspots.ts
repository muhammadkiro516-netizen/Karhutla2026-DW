import { HOTSPOT } from "@/config/thresholds";
import type { Confidence, Hotspot, HotspotCluster } from "@/types/domain";

const RANK: Record<Confidence, number> = { RENDAH: 0, SEDANG: 1, TINGGI: 2 };

/** VIIRS uses l/n/h; MODIS uses 0–100. */
export function parseConfidence(raw: string | number | undefined): Confidence | null {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim().toLowerCase();
  if (s === "l" || s === "low") return "RENDAH";
  if (s === "n" || s === "nominal") return "SEDANG";
  if (s === "h" || s === "high") return "TINGGI";
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return n < 30 ? "RENDAH" : n < 80 ? "SEDANG" : "TINGGI";
}

/** FIRMS acq_date "2026-10-21" + acq_time "547" | "0547" (UTC HHMM) -> ISO UTC. */
export function acqToUtcIso(date: string, time: string | number): string | null {
  const t = String(time).padStart(4, "0");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{4}$/.test(t)) return null;
  return `${date}T${t.slice(0, 2)}:${t.slice(2)}:00Z`;
}

export type FirmsRow = Record<string, string | undefined>;

export function normalizeRow(row: FirmsRow, satellite: string): Hotspot | null {
  const lat = Number(row.latitude);
  const lon = Number(row.longitude);
  const frp = Number(row.frp);
  const confidence = parseConfidence(row.confidence);
  const acqUtc = acqToUtcIso(row.acq_date ?? "", row.acq_time ?? "");
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !confidence || !acqUtc) return null;
  return { lat, lon, frp: Number.isFinite(frp) ? frp : 0, confidence, acqUtc, satellite };
}

/** Grid clustering (~2.2 km) merges duplicate detections of one fire from 3 VIIRS satellites. */
export function clusterHotspots(points: Hotspot[], cellDeg: number = HOTSPOT.clusterCellDeg): HotspotCluster[] {
  const cells = new Map<string, Hotspot[]>();
  for (const p of points) {
    const key = `${Math.floor(p.lat / cellDeg)}_${Math.floor(p.lon / cellDeg)}`;
    const arr = cells.get(key);
    if (arr) arr.push(p); else cells.set(key, [p]);
  }
  return [...cells.entries()]
    .map(([id, pts]) => ({
      id,
      lat: pts.reduce((a, p) => a + p.lat, 0) / pts.length,
      lon: pts.reduce((a, p) => a + p.lon, 0) / pts.length,
      count: pts.length,
      maxFrp: Math.max(...pts.map((p) => p.frp)),
      sumFrp: Math.round(pts.reduce((a, p) => a + p.frp, 0) * 10) / 10,
      confidence: pts.reduce<Confidence>((best, p) => (RANK[p.confidence] > RANK[best] ? p.confidence : best), "RENDAH"),
      latestUtc: pts.map((p) => p.acqUtc).sort().at(-1) ?? pts[0].acqUtc,
      satellites: [...new Set(pts.map((p) => p.satellite))],
    }))
    .sort((a, b) => b.maxFrp - a.maxFrp);
}

/** "14.05 WIB" style label in the city's own zone. */
export function formatLocalTime(isoUtc: string, tz: string, tzLabel: string): string {
  const s = new Intl.DateTimeFormat("id-ID", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(isoUtc));
  return `${s} ${tzLabel}`;
}
