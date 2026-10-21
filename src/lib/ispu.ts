import { ISPU_PM25_BREAKPOINTS } from "@/config/thresholds";
import type { HourlyPoint, IspuCategory, IspuResult } from "@/types/domain";

// Official ISPU colours (P.14/2020): hijau, biru, kuning, merah, hitam.
export const ISPU_META: Record<IspuCategory, { label: string; color: string }> = {
  BAIK: { label: "Baik", color: "#16A34A" },
  SEDANG: { label: "Sedang", color: "#2563EB" },
  TIDAK_SEHAT: { label: "Tidak Sehat", color: "#EAB308" },
  SANGAT_TIDAK_SEHAT: { label: "Sangat Tidak Sehat", color: "#DC2626" },
  BERBAHAYA: { label: "Berbahaya", color: "#111827" },
};

/** PM2.5 (µg/m³) -> ISPU via linear interpolation. Returns null for invalid input. */
export function pm25ToIspu(pm25: number | null | undefined): IspuResult | null {
  if (pm25 == null || !Number.isFinite(pm25) || pm25 < 0) return null;
  // Breakpoints sit on a 0.1 grid; rounding removes the 15.5–15.6 style gaps.
  const c = Math.round(pm25 * 10) / 10;
  const top = ISPU_PM25_BREAKPOINTS[ISPU_PM25_BREAKPOINTS.length - 1];
  if (c > top.cHi) return build(top.iHi, top.category, true);
  const bp = ISPU_PM25_BREAKPOINTS.find((b) => c <= b.cHi) ?? top;
  const raw = ((bp.iHi - bp.iLo) / (bp.cHi - bp.cLo)) * (c - bp.cLo) + bp.iLo;
  const value = Math.min(bp.iHi, Math.max(bp.iLo, Math.round(raw)));
  return build(value, bp.category, false);
}

function build(value: number, category: IspuCategory, capped: boolean): IspuResult {
  return { value, category, capped, ...ISPU_META[category] };
}

/** Category for an already-computed ISPU value (used by the simulation slider). */
export function ispuCategory(value: number): IspuCategory {
  if (value <= 50) return "BAIK";
  if (value <= 100) return "SEDANG";
  if (value <= 200) return "TIDAK_SEHAT";
  if (value <= 300) return "SANGAT_TIDAK_SEHAT";
  return "BERBAHAYA";
}

/** Trailing mean; returns null when fewer than minValid non-null values in the window. */
export function rollingMean(values: (number | null)[], window = 24, minValid = 18): (number | null)[] {
  return values.map((_, i) => {
    const slice = values.slice(Math.max(0, i - window + 1), i + 1).filter((v): v is number => v != null);
    return slice.length >= Math.min(minValid, window) ? slice.reduce((a, b) => a + b, 0) / slice.length : null;
  });
}

/** Hourly PM2.5 -> hourly "ISPU indikatif" (per-hour) series. */
export function toIspuSeries(pm25: HourlyPoint[]): HourlyPoint[] {
  return pm25.map((p) => ({ time: p.time, value: pm25ToIspu(p.value)?.value ?? null }));
}

/** Official-comparable ISPU from 24h rolling mean of PM2.5 (latest value). */
export function ispu24h(pm25: HourlyPoint[]): IspuResult | null {
  const means = rollingMean(pm25.map((p) => p.value));
  return pm25ToIspu(means[means.length - 1] ?? null);
}
