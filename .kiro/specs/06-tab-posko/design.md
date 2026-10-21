# 06 Tab Posko — Design

Components (`components/posko/`): `FacilityFilters`, `FacilityCard`, `StockChips`, `StockEditSheet`, `ReportSheet`, `EvidencePanel`, `RecentReports`, `EmergencyCard`, `SelfHelpCard`.
Evidence wrapper `src/lib/evidence-browser.ts` (client-only): `analyzeFile(file, city)` → `exifr.parse(file, { pick: ["DateTimeOriginal","latitude","longitude"] })` inside try/catch → `classifyEvidence` + `sha256Hex(await file.arrayBuffer())`. Reject files >15 MB with message.
Report ID: `LPR-YYYYMMDD-` + first 4 hex of hash (uppercase).
Storage: Supabase tables `reports`, `facility_stock` (see `supabase/schema.sql`) else localStorage `eduair.reports`, `eduair.stock`.
Seed stock: deterministic per facility id (hash → Banyak/Menipis/Habis) so demo is stable across reloads, all `updated_at` = now − random(5..180) min at first load, stored.
`supabase/schema.sql`: tables `facility_stock`, `reports`, `school_decisions` (+ `prev_hash`, `hash`); RLS: select public; insert reports public; stock/decision writes only via service route (passcode check), never from anon key.
