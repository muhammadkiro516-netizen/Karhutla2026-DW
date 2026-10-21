---
inclusion: always
---
# EduAir — product rules (always loaded; keep short)

**What**: Indonesian web app that turns satellite hotspots + air quality + wind into *decisions*: school status (Normal/Waspada/Hybrid/Daring Darurat), "asap menuju kota" ETA, nearest clean-air facility, verified citizen reports. Weather-app UX: one big number, one colour, one sentence.

**Users**: Orang tua/warga (read), Kepala Sekolah/Dinas (approve), Petugas Posko (update stock), Relawan (report).

**Non-negotiables**
1. Never fabricate live data. Air, weather, wind, hotspots come only from APIs via `/api/*`. Seeded data (schools, stock) shows a "Data demo" chip; sample hotspots show "Contoh, bukan live".
2. Every data card shows source + local time (`Open-Meteo CAMS • 14.05 WITA`). Use the city's own zone (WIB/WITA) from `src/config/cities.ts`.
3. No blank screens: skeleton → data | stale-cache banner "Data tertunda (diperbarui HH.MM)" + retry | friendly error card + retry.
4. Engine recommends; humans decide. Status becomes official only after "Setujui" and is written to the hash-chained audit log.
5. Show limitations honestly: CAMS ≈ 40 km model, hotspot ≠ confirmed fire, simple drift model, EXIF can be forged, not a replacement for BMKG/BNPB.
6. UI language: Indonesian, plain words (reading level SMP). Code/comments: English.

**Domain core is DONE and tested** in `src/lib/*` and `src/config/*`. Import it; do not re-implement or change thresholds without updating tests.

**Token discipline (applies to every turn)**
- Read only files the current task names; do not scan the repo or re-read steering.
- Edit surgically; never rewrite a whole file to change a few lines.
- Do not paste code into chat. Report in ≤5 bullet lines: what changed, files, test result.
- Ask at most one question, only if blocked.
