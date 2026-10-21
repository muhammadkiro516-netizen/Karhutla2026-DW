import { DRIFT } from "@/config/thresholds";
import { angularDiff, bearingDeg, compassName, destination, downwindDeg, haversineKm } from "@/lib/geo";
import type { DriftImpact, LatLon, WindHour } from "@/types/domain";

type Target = LatLon & { id: string };

/**
 * Hour-by-hour advection trajectory (simple, NOT a dispersion model).
 * Each hour the plume centre moves with that hour's wind at the SOURCE location;
 * a city is "hit" when it falls inside a corridor whose half-width grows with distance.
 */
export function simulateDrift(origin: LatLon, wind: WindHour[], targets: readonly Target[], cfg = DRIFT): DriftImpact[] {
  if (wind.length === 0) return [];
  const hits = new Map<string, DriftImpact>();
  let pos = origin;
  let travelled = 0;
  const SUB = 6;

  for (let h = 0; h < cfg.maxHours; h++) {
    const w = wind[Math.min(h, wind.length - 1)];
    const speed = w.windKmh >= cfg.minWindKmh ? w.windKmh : 0;
    const next = speed > 0 ? destination(pos, downwindDeg(w.windFromDeg), speed) : pos;
    for (let s = 0; s <= SUB; s++) {
      const f = s / SUB;
      const p = { lat: pos.lat + (next.lat - pos.lat) * f, lon: pos.lon + (next.lon - pos.lon) * f };
      const half = cfg.baseHalfWidthKm + cfg.spreadPerKm * (travelled + speed * f);
      for (const t of targets) {
        if (hits.has(t.id)) continue;
        if (haversineKm(p, t) <= half) {
          hits.set(t.id, { cityId: t.id, etaHours: Math.round((h + f) * 10) / 10, distanceKm: Math.round(haversineKm(origin, t)) });
        }
      }
    }
    pos = next;
    travelled += speed;
  }
  return [...hits.values()].sort((a, b) => a.etaHours - b.etaHours);
}

/** Legacy single-wind cone (±45°, ≤300 km). Used only when no hourly series is available. */
export function coneDrift(origin: LatLon, city: LatLon, windFromDeg: number, windKmh: number, cfg = DRIFT) {
  const distanceKm = haversineKm(origin, city);
  const diff = angularDiff(bearingDeg(origin, city), downwindDeg(windFromDeg));
  const affected = windKmh >= cfg.minWindKmh && diff <= cfg.coneFallbackDeg && distanceKm <= cfg.coneFallbackMaxKm;
  return { affected, distanceKm, etaHours: affected ? distanceKm / windKmh : null, angleDiff: diff };
}

const fmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 1 });

export function driftSentence(p: { windFromDeg: number; windKmh: number; sourceNear: string; sourceKm: number; city: string; etaHours: number }): string {
  const when = p.etaHours < 1 ? "kurang dari 1 jam" : `sekitar ${fmt(p.etaHours)} jam`;
  return `Angin dari ${compassName(p.windFromDeg)} ±${Math.round(p.windKmh)} km/jam berpotensi membawa asap dari titik api dekat ${p.sourceNear} (${Math.round(p.sourceKm)} km) ke ${p.city} dalam ${when}.`;
}

export const DRIFT_DISCLAIMER = "Perkiraan sederhana berbasis angin permukaan (bukan model dispersi).";
