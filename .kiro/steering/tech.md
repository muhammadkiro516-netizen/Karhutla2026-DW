---
inclusion: always
---
# Tech (always loaded)

- Next.js (latest stable, App Router, `src/` dir) + TypeScript strict, no `any`. Path alias `@/*` → `src/*` (no `baseUrl`; TS 6 deprecates it).
- Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`). No other CSS framework.
- Data: SWR on client; Route Handlers in `src/app/api/*` as thin proxy (keys server-only, zod-validated, cached).
- Libs (only these unless a task says otherwise): `swr zod recharts framer-motion lucide-react exifr papaparse qrcode` + dev `vitest fast-check @types/papaparse @types/qrcode`. Supabase (`@supabase/supabase-js`) optional behind env check.
- Tests: Vitest (`vitest.config.ts` exists). Pure logic tests live in `src/lib/__tests__`. Do not add Jest.
- Env (`.env.example`): `FIRMS_MAP_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSCODE`, `OPENAQ_API_KEY` (optional). Missing env ⇒ demo/fallback mode, never a crash.
- Commands: `npm run dev`, `npm run build`, `npx vitest run`, `npx tsc --noEmit`, `npm run lint`.
- Deploy target: Vercel. Route handlers use `export const revalidate = <seconds>` from `CACHE_SECONDS` plus an in-memory last-good cache for stale fallback.
