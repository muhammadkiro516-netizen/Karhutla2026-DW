# 01 Foundation — Design

- `src/app/layout.tsx`: font (Plus Jakarta Sans, `display: swap`), `<html lang="id">`, theme script in `<head>` (sets `data-theme` before paint, avoids flash), `AppShell`.
- `AppShell` (client): `SideRail` ≥lg, `BottomNav` <lg, top bar with `CityChips`, `ThemeToggle`, mode toggles in a settings Sheet. Active tab from `usePathname`.
- `useCity()`: source order query `?kota` → localStorage → `DEFAULT_CITY`; setter updates both (router.replace, no scroll).
- `useLocalStore<T>(key, initial)`: SSR-safe, try/catch around storage, returns `[value, set]`.
- `useModes()`: `{ vulnerable, lowData }` via useLocalStore.
- Geolocation: `navigator.geolocation.getCurrentPosition` (timeout 8 s) → `nearest()` from `@/lib/geo`.
- Tokens in `globals.css` `@theme`: colours for ISPU from `ISPU_META` mirrored as CSS vars `--ispu-baik` … ; neutrals; `--radius-card`; shadows; glass `backdrop-blur-md bg-white/60 dark:bg-zinc-900/50`.
- `Sheet`: one component; bottom sheet <lg, centered dialog ≥lg; focus trap, Esc closes, `aria-modal`.
- `ModeBanner`: shows active "Mode Simulasi"/"Mode Demo"/"Mode Rentan" badges globally.
- i18n: plain object `id` with nested keys; helper `t(path)` not needed — import object directly (tree-shaken, zero runtime).
