# 01 Foundation — Tasks

- [-] 1. Install deps listed in `tech.md`; add scripts `test: vitest run`, `typecheck: tsc --noEmit`; confirm `npx vitest run` passes on existing core tests. _R5_
- [~] 2. Create `src/i18n/id.ts` (nav labels, modes, states, emergency numbers placeholder, disclaimers) and `.env.example`. _R5.1_
- [~] 3. Tokens + base styles in `globals.css` (`@theme`, dark variant via `[data-theme=dark]`), layout.tsx with font + no-flash theme script. _R3.1, R5.2_
- [~] 4. `useLocalStore`, `useCity`, `useModes` hooks. _R2.2, R3.2, R3.3_
- [~] 5. UI primitives in `components/ui/` (Card, Chip, Badge, Sheet, Skeleton, SourceTag, StaleBanner, ErrorCard, EmptyState, DemoChip). _R4_
- [~] 6. Shell: AppShell, BottomNav, SideRail, CityChips (+ "Gunakan lokasi saya"), ThemeToggle, settings Sheet with mode toggles, ModeBanner; 4 empty tab pages + `/` redirect. _R1, R2, R3_
- [~] 7. Verify at 360/768/1440 that nav never covers content; run typecheck + lint. _R1.1, R5.2_
