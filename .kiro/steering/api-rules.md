---
inclusion: fileMatch
fileMatchPattern: ["src/app/api/**/*.ts", "src/server/**/*.ts", "src/hooks/**/*.ts"]
---
# API & data rules (loaded only when editing data layer)

**Envelope**: every route returns `ApiEnvelope<T>` from `@/types/domain` (`data, source, fetchedAt, stale, demo?`). Errors: `{ error: string }` with 4xx/5xx; client shows ErrorCard.

**Upstreams** (exact):
- Air, ALL cities in ONE call (comma-separated coords, `timezone=auto`):
  `https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lats}&longitude={lons}&current=pm2_5,pm10,us_aqi&hourly=pm2_5,pm10,us_aqi&past_days=1&forecast_days=2&timezone=auto`
  Response is an array (one object per location, same order). If upstream returns a single object, wrap it. Fallback: per-city calls.
- Weather/wind, ALL cities in ONE call: `https://api.open-meteo.com/v1/forecast?latitude={lats}&longitude={lons}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&hourly=wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh&forecast_days=2&timezone=auto`
- Hotspots: for each source in `FIRMS_SOURCES`: `https://firms.modaps.eosdis.nasa.gov/api/area/csv/{FIRMS_MAP_KEY}/{SOURCE}/95,-11,141,6/2` → papaparse (header) → `normalizeRow` → merge → `clusterHotspots`. One failing source must not fail the route. Key missing ⇒ return `src/data/sample-hotspots.json` with `demo: true`.
- Wind at fire locations (for drift): ONE forecast call with comma-separated coords of top `HOTSPOT.driftTopClusters` clusters, `hourly=wind_speed_10m,wind_direction_10m&forecast_days=2&timezone=UTC`; slice from current hour; run `simulateDrift(cluster, windSeries, CITIES)`.
- Facilities: Overpass POST `https://overpass-api.de/api/interpreter`, `[out:json][timeout:25];(nwr["amenity"~"^(hospital|clinic|doctors|pharmacy)$"](around:15000,{lat},{lon}););out center tags 200;` Merge with seed regional hospitals; dedupe by name+~200 m.

**Caching**: `server/cache.ts` = Map<key,{value, at}>. Serve fresh if age < `CACHE_SECONDS[x]`; on upstream error return last-good with `stale: true`; no last-good ⇒ 502 `{error}`. Also `export const revalidate`. Set `Cache-Control: public, s-maxage=N, stale-while-revalidate=N*6`.

**Validation**: zod schema per upstream; reject `city` not in `CITIES` (400). Never log keys. Timeout every fetch at 10 s (`AbortSignal.timeout`).

**Client hooks**: SWR with `refreshInterval` 10 min (air/weather), 15 min (hotspots), `revalidateOnFocus: true`, `keepPreviousData: true`. Persist last envelope to `localStorage` (try/catch) for offline first paint.

**Writes** (`/api/reports`, `/api/stock`): rate-limit 5/min/IP in memory; stock requires header `x-admin-passcode === ADMIN_PASSCODE`. Supabase if env present, else respond `{demo:true}` and client stores in localStorage. Reports never store raw GPS publicly — store distance-to-city + status + hash only.
