import type { LatLon } from "@/types/domain";

const R = 6371; // km
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export function haversineKm(a: LatLon, b: LatLon): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial bearing a -> b in degrees [0, 360). */
export function bearingDeg(a: LatLon, b: LatLon): number {
  const y = Math.sin(rad(b.lon - a.lon)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lon - a.lon));
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** Point reached from `p` travelling `km` along `bearing`. */
export function destination(p: LatLon, bearing: number, km: number): LatLon {
  const d = km / R;
  const b = rad(bearing);
  const lat1 = rad(p.lat);
  const lon1 = rad(p.lon);
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(b));
  const lon2 = lon1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: deg(lat2), lon: ((deg(lon2) + 540) % 360) - 180 };
}

/** Smallest absolute difference between two bearings, 0..180. */
export function angularDiff(a: number, b: number): number {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return d > 180 ? 360 - d : d;
}

/** Meteorological wind is "from"; smoke travels toward from+180. */
export const downwindDeg = (windFromDeg: number) => (windFromDeg + 180) % 360;

const COMPASS = ["utara", "timur laut", "timur", "tenggara", "selatan", "barat daya", "barat", "barat laut"] as const;
export function compassName(bearing: number): (typeof COMPASS)[number] {
  return COMPASS[Math.round((((bearing % 360) + 360) % 360) / 45) % 8];
}

export function nearest<T extends LatLon>(p: LatLon, items: readonly T[]): { item: T; km: number } {
  let best = { item: items[0], km: haversineKm(p, items[0]) };
  for (const it of items.slice(1)) {
    const km = haversineKm(p, it);
    if (km < best.km) best = { item: it, km };
  }
  return best;
}

export const inBbox = (p: LatLon, [w, s, e, n]: readonly [number, number, number, number] | readonly number[]) =>
  p.lon >= w && p.lon <= e && p.lat >= s && p.lat <= n;
