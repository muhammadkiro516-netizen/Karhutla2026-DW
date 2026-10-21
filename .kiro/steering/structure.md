---
inclusion: always
---
# Structure (always loaded)

```
src/
  app/
    layout.tsx, globals.css, page.tsx (redirect → /udara)
    (tabs)/udara | sekolah | titik-api | posko /page.tsx
    s/[school]/page.tsx        public school status page (QR target)
    about/page.tsx             problem, novelty, method, limits, sources
    api/air | weather | hotspots | facilities | reports | stock /route.ts
  components/
    ui/        primitives: Card, Chip, Badge, Sheet, Skeleton, SourceTag, StaleBanner, ErrorCard, DemoChip
    shell/     AppShell, BottomNav, SideRail, CityChips, ThemeToggle, ModeBanner
    udara/ sekolah/ titik-api/ posko/   feature components
  config/      cities.ts, thresholds.ts  (DONE — single source of truth)
  types/       domain.ts                 (DONE — shared contract)
  lib/         pure logic (DONE + tests); add new pure helpers here with tests
  server/      fetchers + cache (server-only): openmeteo.ts, firms.ts, overpass.ts, cache.ts
  hooks/       useCity, useAir, useWeather, useHotspots, useFacilities, useLocalStore
  data/        seed.ts (schools, stock, regional hospitals) — demo only
  i18n/id.ts   all UI strings (one place; keeps components small)
supabase/schema.sql
scripts/backtest.ts
```
Rules: components never call upstream APIs; only `src/server/*` does. One component per file, ≤150 lines; split otherwise. Feature folders import from `ui/`, never from each other.
