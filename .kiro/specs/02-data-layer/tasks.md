# 02 Data layer — Tasks

- [ ] 1. `src/types/api.ts` shapes from design; `src/server/cache.ts` + unit test for stale fallback (fake timers). _R5.1_
- [ ] 2. `openmeteo.ts` with zod schemas; `GET /api/air` building `AirCity[]` using `toIspuSeries`, `ispu24h`, `evaluateSchoolStatus` (normal + vulnerable), `forecastSchoolDay` for tomorrow's local date. _R1_
- [ ] 3. `GET /api/weather`. _R2_
- [ ] 4. `firms.ts` + `sample-hotspots.json`; `GET /api/hotspots` with clustering, nearest city, region (`inBbox` over `REGIONS`), batched wind for top clusters, `simulateDrift`, threat ranking, `latestUtc`, `sourcesOk`. _R3_
- [ ] 5. `overpass.ts` + seed hospitals in `src/data/seed.ts`; `GET /api/facilities`. _R4_
- [ ] 6. Client hooks with localStorage hydrate. _R5.3_
- [ ] 7. Manually call each route once (curl/browser) and confirm envelope + WITA times for Samarinda; run typecheck + tests. _R5_
