---
inclusion: fileMatch
fileMatchPattern: ["src/components/**/*.tsx", "src/app/**/*.tsx", "src/app/globals.css"]
---
# UI system (loaded only when editing UI)

**Feel**: calm, minimal, Apple/Google Weather. One idea per section. Max 3 key numbers in hero.

**Colour**: ISPU uses OFFICIAL KLHK colours from `ISPU_META` (hijau, biru, kuning, merah, hitam). Hero = soft gradient derived from that colour (e.g. `color-mix` 15–30% over neutral), transition 600ms. Never use colour alone: always icon + text label.

**Tokens** (`@theme`): radius `--radius-card: 1.5rem`; spacing 8pt grid; font Plus Jakarta Sans via `next/font` (fallback Inter); hero number 80px mobile / 112px desktop, weight 300, tabular-nums.

**Layout**
- Mobile first, verified at 360 / 768 / 1440. No horizontal page scroll.
- <1024px: fixed BottomNav (4 tabs, icons + labels, safe-area padding, content `pb-[calc(72px+env(safe-area-inset-bottom))]`). ≥1024px: SideRail + 2-column content (main + context panel).
- City chips: horizontal scroll-snap; selected chip shows mini ISPU dot.
- Details go in bottom Sheet (mobile) / Dialog (desktop) — same component, responsive.

**States** every data component must render: loading (Skeleton same size as content, no CLS), ok, stale (StaleBanner), error (ErrorCard + retry), empty (message + reset action), demo (DemoChip).

**Motion** (framer-motion): tab cross-fade 200ms, count-up on ISPU, stagger cards 40ms, pulse only on Daring Darurat badge. Wrap in `useReducedMotion` → no animation.

**A11y**: AA contrast in light & dark, touch ≥44px, `aria-live="polite"` on status changes, focus rings visible, keyboard reachable Sheet with focus trap, `lang="id"`.

**Dark mode**: system default + toggle (persist `localStorage`, try/catch). Black ISPU (Berbahaya) on dark bg: use outline + white text.

**Copy**: from `src/i18n/id.ts` only. Sentences short. Numbers with Indonesian format (`toLocaleString("id-ID")`).
