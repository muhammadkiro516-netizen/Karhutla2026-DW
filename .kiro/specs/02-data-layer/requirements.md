# 02 Data layer — Requirements

## R1 Air quality
1.1 `GET /api/air` SHALL return, for all 8 cities, current PM2.5/PM10/US AQI and hourly PM2.5/US AQI for past 24 h + next 48 h, with each city's timezone label, using ONE upstream call (fallback per-city).
1.2 THE SYSTEM SHALL compute per city: `ispuNow` (hourly indicative), `ispu24h`, hourly ISPU series, `status` (school engine, normal & vulnerable), and `tomorrow` (`forecastSchoolDay`).

## R2 Weather & wind
2.1 `GET /api/weather` SHALL return current temp, humidity, wind speed/direction and hourly wind for 48 h for all cities in one upstream call.

## R3 Hotspots & drift
3.1 `GET /api/hotspots` SHALL merge VIIRS S-NPP, NOAA-20 and NOAA-21 (last 2 days, Indonesia bbox), cluster duplicates, and return clusters with nearest city + distance + region id.
3.2 For the top 40 clusters by FRP THE SYSTEM SHALL fetch hourly wind at the cluster location (one batched call) and attach `simulateDrift` impacts.
3.3 THE SYSTEM SHALL return per-city threat ranking: number of clusters whose drift hits the city within 24 h and the earliest ETA.
3.4 IF `FIRMS_MAP_KEY` is missing THEN the route SHALL return bundled sample data with `demo: true`; IF one satellite source fails THEN the others SHALL still be returned and `source` SHALL list which succeeded.
3.5 THE SYSTEM SHALL report the latest acquisition time so the UI can say "Data satelit terakhir: 13.40 WIB".

## R4 Facilities
4.1 `GET /api/facilities?city=` SHALL return hospitals, clinics/puskesmas, doctors, pharmacies within 15 km from Overpass merged with seeded regional hospitals, with type, name, address, phone (if tagged), lat/lon, distance from city centre.

## R5 Reliability & safety
5.1 Every route SHALL return `ApiEnvelope`, validate inputs (400 on unknown city), time out upstreams at 10 s, cache per `CACHE_SECONDS`, and serve last-good data with `stale: true` on upstream failure.
5.2 Keys SHALL never reach the client bundle or logs.
5.3 Client hooks SHALL keep previous data while revalidating and hydrate from localStorage for instant offline first paint.

## Change log (vibe)
