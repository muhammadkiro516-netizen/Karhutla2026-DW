# 04 Tab Sekolah — Design

Seed (`src/data/seed.ts`): `SCHOOLS: { slug; name; cityId; level: "PAUD"|"SD"|"SMP"|"SMA"|"SLB" }[]` — generic plausible names ("SD Negeri Contoh 12 Pekanbaru"); suffix "(demo)" in UI, never real school names.
Components (`components/sekolah/`): `SchoolList`, `StatusBadge`, `WhySheet`, `TomorrowStrip`, `RoleSwitch`, `ApproveSheet`, `AuditLog`, `AnnouncementCard`, `QrPoster` (uses `qrcode` → data URL, printable), `SimulationPanel`, `RuleCard`.
State: `useDecisions()` — Supabase table `school_decisions` if env else localStorage key `eduair.decisions`; always stores the hash-chain fields (`prevHash`, `hash`).
Simulation: build series `Array(24-d).fill(baseline).concat(Array(d).fill(slider))` → `deriveStatusTimeline`. Global `ModeBanner` shows "Mode Simulasi".
Public page `/s/[school]`: server component, fetches `/api/air` internally (same cache), renders without client JS except share button; `generateMetadata` for WhatsApp preview ("Status SD … : Hybrid").
Print: `@media print` hides nav/buttons; announcement + QR only.
PIN: `NEXT_PUBLIC_DEMO_PIN` default "2026" — UI says "PIN demo; produksi memakai login Supabase".
