# 07 PWA, Quality & About — Design

- Manifest: `src/app/manifest.ts` (Next metadata route). Icons generated as simple SVG-to-PNG in `public/icons/` (wind/leaf glyph, no brand marks).
- Service worker: hand-written `public/sw.js` (~60 lines, no workbox dep): precache `/`, tab routes, CSS/JS chunks discovered at runtime; runtime strategy for `/api/*` network-first with 10 s timeout. Register in a client component only in production.
- `/about`: server component, content from `src/i18n/id.ts` → `about` section; uses same Card primitives; includes the 4-step flow diagram as inline SVG (Data → Hitung → Rekomendasi → Persetujuan manusia).
- Backtest: `tsx scripts/backtest.ts --city jambi --from 2023-09-01 --to 2023-10-31`; reuses `toIspuSeries`, `deriveStatusTimeline`; Node 20+ fetch. Before relying on it, check that Open-Meteo returns data for that period/location; if not, print a clear message and exit 0.
