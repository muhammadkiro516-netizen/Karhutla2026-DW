-- EduAir Supabase schema
-- RLS: select public; inserts via service route only (passcode checked server-side)

create table if not exists facility_stock (
  id uuid primary key default gen_random_uuid(),
  facility_id text not null,
  item text not null,
  level text not null check (level in ('BANYAK', 'MENIPIS', 'HABIS')),
  updated_at timestamptz not null default now(),
  unique (facility_id, item)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  report_id text not null unique,
  city_id text not null,
  description text not null,
  evidence_hash text,
  status text not null,
  at timestamptz not null default now()
);

create table if not exists school_decisions (
  id uuid primary key default gen_random_uuid(),
  at timestamptz not null,
  city_id text not null,
  school text not null,
  ispu integer not null,
  recommended text not null,
  decided text not null,
  approver text not null,
  note text,
  prev_hash text not null,
  hash text not null unique
);

-- RLS
alter table facility_stock enable row level security;
alter table reports enable row level security;
alter table school_decisions enable row level security;

create policy "public_read_stock" on facility_stock for select using (true);
create policy "public_read_reports" on reports for select using (true);
create policy "public_read_decisions" on school_decisions for select using (true);
create policy "public_insert_reports" on reports for insert with check (true);
