---
inclusion: fileMatch
fileMatchPattern: ["src/lib/**/*.ts", "src/config/**/*.ts", "src/types/**/*.ts"]
---
# Domain rules (loaded only when editing core logic)

Source of truth: #[[file:src/config/thresholds.ts]] and #[[file:src/types/domain.ts]].

- ISPU: PM2.5 breakpoints P.14/2020, value rounded to 0.1 before lookup, capped at 500 (`capped:true`). Show TWO numbers honestly: "ISPU per jam (indikatif)" for triggers/hero, "ISPU 24 jam" (`ispu24h`) as the official-comparable value. US AQI only as secondary.
- School engine: `deriveStatusTimeline` replays hourly ISPU; escalate when rule met (Waspada >100 1h, Hybrid >150 3h, Daring >200 2h); step down after 3 valid hours ≤ current threshold; null never escalates/counts. Vulnerable mode = thresholds −50. Tomorrow: `forecastSchoolDay` over school hours 06–13, shown from 18.00 local.
- Drift: hourly trajectory with wind AT THE FIRE, corridor half-width 10 km + 0.25×distance; ETA = plume edge arrival. Cone fallback only without hourly data. Always show `DRIFT_DISCLAIMER`.
- Evidence statuses: TERVERIFIKASI / SEBAGIAN / TIDAK_SESUAI / BELUM_TERVERIFIKASI with reasons; (0,0) GPS = missing.
- Audit: `appendDecision` / `verifyChain` (SHA-256 hash chain). UI shows "Rantai log utuh ✓" or the first broken entry.

Any change here ⇒ update `src/lib/__tests__` in the same task and keep all tests green.
