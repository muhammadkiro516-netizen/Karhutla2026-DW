# 05 Tab Titik Api — Design

Components (`components/titik-api/`): `HotspotSummary`, `ThreatRanking`, `RegionChips`, `HotspotFilters`, `ClusterCard`, `ClusterList`, `HonestyNote`.
Data: `useHotspots()` payload from spec 02 (clusters already carry `drift`, `nearestCityId`, `regionId`).
Filtering/sorting in pure `src/lib/hotspot-filter.ts` (`filterClusters(clusters, {region, confidence, query, sort, fromCity})`) with Vitest cases; components stay dumb.
Drift sentence wind values: use the cluster's first-hour wind returned by the API (add `windNow: WindHour` to cluster payload in spec 02 if missing — small backward-compatible change).
No map (decision: speed, no map key, mobile clarity). Each card has "Lihat di peta" link → `https://www.google.com/maps?q={lat},{lon}`.
