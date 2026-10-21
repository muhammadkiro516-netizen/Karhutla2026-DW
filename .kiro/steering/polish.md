---
inclusion: manual
---
# /polish — visual quality pass on ONE screen (use: `/polish udara|sekolah|titik-api|posko`)

Check and fix only that route's components, in this order, stopping when the token budget feels large:
1. 360px: no horizontal scroll, nothing hidden behind BottomNav, touch targets ≥44px, text ≥14px.
2. 1440px: content max-width 1200px, 2-column layout uses the context panel, no stretched cards.
3. Hierarchy: one hero idea; secondary info in Sheet; ≤3 numbers in hero.
4. States: loading skeleton matches final size; stale/error/empty/demo all reachable (temporarily toggle via `?state=` query in dev only).
5. Dark mode contrast AA; Berbahaya (black) readable.
6. Motion respects reduced-motion; only Daring badge pulses.
Output a ≤8-line checklist of what you fixed.
