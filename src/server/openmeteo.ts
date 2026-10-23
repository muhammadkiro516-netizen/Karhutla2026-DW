import "server-only";
import { z } from "zod";
import { CITIES } from "@/config/cities";
import type { WindHour } from "@/types/domain";

// Split a large city list into chunks to avoid URL-length limits on upstream APIs.
function chunk<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const latsStr = (cs: readonly { lat: number }[]) => cs.map(c => c.lat).join(",");
const lonsStr = (cs: readonly { lon: number }[]) => cs.map(c => c.lon).join(",");

// Batch size: Open-Meteo accepts multiple coords per call. Keep URLs well under typical
// 8 KB limit. 50 coords ≈ ~1.5 KB of query string — comfortable margin.
const BATCH_SIZE = 50;

// Zod schema for one location block from Open-Meteo air quality API
const AirBlock = z.object({
  current: z.object({
    pm2_5: z.number().nullable().optional(),
    pm10: z.number().nullable().optional(),
    us_aqi: z.number().nullable().optional(),
  }).optional(),
  hourly: z.object({
    time: z.array(z.string()),
    pm2_5: z.array(z.number().nullable()),
    pm10: z.array(z.number().nullable()).optional(),
    us_aqi: z.array(z.number().nullable()).optional(),
  }),
  timezone: z.string().optional(),
  timezone_abbreviation: z.string().optional(),
  utc_offset_seconds: z.number().optional(),
});

const WeatherBlock = z.object({
  current: z.object({
    temperature_2m: z.number().nullable().optional(),
    relative_humidity_2m: z.number().nullable().optional(),
    wind_speed_10m: z.number().nullable().optional(),
    wind_direction_10m: z.number().nullable().optional(),
  }).optional(),
  hourly: z.object({
    time: z.array(z.string()),
    wind_speed_10m: z.array(z.number().nullable()),
    wind_direction_10m: z.array(z.number().nullable()),
  }),
  timezone: z.string().optional(),
});

async function fetchJson(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function normalizeToArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") return [raw];
  return [];
}

export async function fetchAirAll(): Promise<z.infer<typeof AirBlock>[]> {
  const batches = chunk(CITIES, BATCH_SIZE);
  const results = await Promise.all(batches.map(async (cs) => {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latsStr(cs)}&longitude=${lonsStr(cs)}&current=pm2_5,pm10,us_aqi&hourly=pm2_5,pm10,us_aqi&past_days=1&forecast_days=2&timezone=auto`;
    const raw = await fetchJson(url);
    return normalizeToArray(raw).map(b => AirBlock.parse(b));
  }));
  return results.flat();
}

export async function fetchWeatherAll(): Promise<z.infer<typeof WeatherBlock>[]> {
  const batches = chunk(CITIES, BATCH_SIZE);
  const results = await Promise.all(batches.map(async (cs) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latsStr(cs)}&longitude=${lonsStr(cs)}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&hourly=wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh&forecast_days=2&timezone=auto`;
    const raw = await fetchJson(url);
    return normalizeToArray(raw).map(b => WeatherBlock.parse(b));
  }));
  return results.flat();
}

export async function fetchWindAt(points: { lat: number; lon: number }[]): Promise<WindHour[][]> {
  if (points.length === 0) return [];
  const batches = chunk(points, BATCH_SIZE);
  const results = await Promise.all(batches.map(async (cs) => {
    const latsP = cs.map(p => p.lat).join(",");
    const lonsP = cs.map(p => p.lon).join(",");
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latsP}&longitude=${lonsP}&hourly=wind_speed_10m,wind_direction_10m&forecast_days=2&timezone=UTC&wind_speed_unit=kmh`;
    const raw = await fetchJson(url);
    return normalizeToArray(raw);
  }));
  const rawBlocks = results.flat();
  return rawBlocks.map(block => {
    const b = WeatherBlock.parse(block);
    return b.hourly.time.map((_t, i) => ({
      windFromDeg: b.hourly.wind_direction_10m[i] ?? 0,
      windKmh: b.hourly.wind_speed_10m[i] ?? 0,
    }));
  });
}
