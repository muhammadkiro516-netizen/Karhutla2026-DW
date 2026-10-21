---
inclusion: manual
---
# /demo-check — pre-presentation verification (use: `/demo-check`)

Run, do not guess. Report PASS/FAIL per line, then fix FAILs one by one (ask before large changes).
1. `npx vitest run` green; `npx tsc --noEmit` clean; `npm run build` passes; `npm run lint` clean.
2. `/api/air`, `/api/weather?city=jambi`, `/api/hotspots`, `/api/facilities?city=pekanbaru` return envelopes; times for Samarinda/Banjarmasin are WITA.
3. Without `FIRMS_MAP_KEY`: hotspots show "Contoh, bukan live" chip. With key: `demo` false.
4. Kill network (simulate upstream throw): stale banner appears, no blank card.
5. Sekolah: slider to 210 for 2 h equivalent → Daring Darurat, pulse, announcement, WhatsApp link encodes text, print view clean. Approve → audit log shows "Rantai log utuh ✓".
6. Titik Api: at least one drift sentence when data allows; disclaimer visible.
7. Posko: upload a photo with GPS → status + SHA-256; photo without EXIF → guidance text.
8. Emergency numbers rendered from `src/i18n/id.ts` (team must verify numbers manually).
9. `/about` lists sources with links, limitations, and "Bukan pengganti informasi resmi BMKG/BNPB".
10. Lighthouse mobile (if available): Performance ≥90, Accessibility ≥95.
