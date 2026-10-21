# 01 Foundation — Requirements

Context: project scaffolded with create-next-app; domain core (`src/lib`, `src/config`, `src/types`) already exists and is tested.

## R1 App shell & navigation
1.1 WHEN the viewport is <1024px THE SYSTEM SHALL show a fixed bottom nav with 4 tabs (Udara, Sekolah, Titik Api, Posko), icon + label, safe-area padding, and content never hidden behind it.
1.2 WHEN the viewport is ≥1024px THE SYSTEM SHALL show a left side rail and a 2-column content area (main + context panel).
1.3 THE SYSTEM SHALL route `/` to `/udara` and keep each tab at its own URL so tabs are shareable.

## R2 City selection
2.1 THE SYSTEM SHALL show the 8 cities from `src/config/cities.ts` as horizontally scrollable chips, default Pekanbaru.
2.2 WHEN a city is chosen THE SYSTEM SHALL persist it in localStorage and in the `?kota=` query param.
2.3 WHEN the user taps "Gunakan lokasi saya" and grants permission THE SYSTEM SHALL select the nearest listed city and say how far it is; IF denied THEN it SHALL keep the current city and show a short note.

## R3 Theme & modes
3.1 THE SYSTEM SHALL follow system dark/light by default and offer a toggle that persists.
3.2 THE SYSTEM SHALL offer "Mode Rentan" (anak kecil/asma/lansia/ibu hamil) toggle, persisted, which lowers decision thresholds (see thresholds.ts) and shows a small badge.
3.3 THE SYSTEM SHALL offer "Mode Hemat Data" which disables charts/animations and refresh intervals become 30 min.

## R4 Data-state primitives
4.1 THE SYSTEM SHALL provide reusable components for: Skeleton, SourceTag (source • local time), StaleBanner, ErrorCard (with retry), EmptyState (with reset), DemoChip.
4.2 Every data card SHALL use these primitives so no card can render blank.

## R5 Copy & accessibility
5.1 All UI strings SHALL live in `src/i18n/id.ts`.
5.2 THE SYSTEM SHALL meet WCAG AA contrast, ≥44px touch targets, visible focus, `lang="id"`, and respect reduced motion.

## Change log (vibe)
