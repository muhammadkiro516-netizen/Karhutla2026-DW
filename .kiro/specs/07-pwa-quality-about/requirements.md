# 07 PWA, Quality & About — Requirements

## R1 Installable & offline
1.1 THE SYSTEM SHALL ship a web manifest (name, short_name "EduAir", icons 192/512 maskable, theme colour) so it can be installed on Android/iOS.
1.2 A service worker SHALL cache the app shell and the last API envelopes (network-first, 10 s timeout, fallback cache) so the last data shows offline with the stale banner.

## R2 About & methodology (for the defense)
2.1 `/about` SHALL present: masalah, solusi, kebaruan (integrasi data→keputusan), metodologi (ISPU, engine, drift, evidence, audit chain) with formulas in plain words, keterbatasan, sumber data with links and licences (Open-Meteo CC BY 4.0, CAMS/Copernicus, NASA FIRMS, OSM ODbL), and "Bukan pengganti informasi resmi BMKG/BNPB".
2.2 A footer link to `/about` SHALL exist on every tab.

## R3 Evaluation tooling
3.1 `scripts/backtest.ts` SHALL fetch historical hourly PM2.5 (Open-Meteo air-quality `start_date`/`end_date`) for a chosen city & period (default 2023-09-01..2023-10-31, Palangka Raya, Jambi, Pekanbaru), run the school engine, and print: days per status, number of status changes (flicker), and for each Daring day whether the previous-evening forecast logic would have flagged it (forecast proxy = actual series; note limitation).
3.2 Output a CSV to `docs/backtest-<city>.csv` for slides.

## R4 Quality gates
4.1 `npm run build`, `npx tsc --noEmit`, `npm run lint`, `npx vitest run` all pass; no console errors.
4.2 Lighthouse mobile target: Performance ≥90, Accessibility ≥95, Best Practices ≥95.
4.3 README: setup, env, API notes, data honesty, limitations, deploy to Vercel, how to run backtest.

## Change log (vibe)
