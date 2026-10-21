# 02 Data layer — Design

Follow `api-rules.md` (auto-loaded) for exact URLs, caching and envelope. This file only lists shapes.

## Server modules (`src/server/`, import "server-only")
- `cache.ts`: `cached<T>(key, ttlSec, fetcher): Promise<{value:T, at:number, stale:boolean}>` (last-good fallback).
- `openmeteo.ts`: `fetchAirAll()`, `fetchWeatherAll()`, `fetchWindAt(points: LatLon[])` → zod-parsed, always returns arrays aligned to input order.
- `firms.ts`: `fetchHotspots(key)` → `Promise.allSettled` over `FIRMS_SOURCES`, papaparse `{header:true, skipEmptyLines:true}`, `normalizeRow`, filter nulls.
- `overpass.ts`: `fetchFacilities(city)`; map tags: `amenity`, `healthcare`, `name`, `addr:street`, `addr:full`, `phone`, `contact:phone`; type mapping hospital→RS, clinic/doctors (+`healthcare=centre` or name contains "Puskesmas")→Puskesmas/Klinik, pharmacy→Apotek.

## Response shapes (add to `src/types/api.ts`)
```ts
AirCity { cityId; tzLabel; updatedLocal; pm25; pm10; usAqi; ispuNow: IspuResult|null; ispu24h: IspuResult|null;
  hourly: { time: string; pm25: number|null; ispu: number|null; usAqi: number|null; forecast: boolean }[];
  status: SchoolStatus; statusVulnerable: SchoolStatus;
  tomorrow: { date: string; status: SchoolStatus; peakIspu: number|null; window: string } | null }
WeatherCity { cityId; temp; rh; windKmh; windFromDeg; hourlyWind: {time:string; windKmh:number; windFromDeg:number}[] }
HotspotPayload { clusters: (HotspotCluster & { nearestCityId; nearestKm; regionId: string|null; drift: DriftImpact[] })[];
  threat: { cityId; clusters: number; earliestEtaHours: number|null }[]; latestUtc: string|null; sourcesOk: string[] }
Facility { id; type: "RS"|"PUSKESMAS_KLINIK"|"APOTEK"|"POSKO"; name; address?; phone?; lat; lon; distanceKm; seeded: boolean }
```
- Hourly split: `forecast = time > current hour` (local). School engine uses only non-forecast points for `status`.
- `src/data/sample-hotspots.json`: ~30 rows in FIRMS CSV-like JSON (realistic coordinates in Riau/Jambi/Kalteng); file header comment "SAMPLE – not live". Clearly synthetic: acq_date set at runtime to today.

## Client hooks (`src/hooks/`)
`useAir()`, `useWeather()`, `useHotspots()`, `useFacilities(cityId)` — SWR + localStorage hydrate; return `{ data, envelope, isLoading, error, retry }`.
