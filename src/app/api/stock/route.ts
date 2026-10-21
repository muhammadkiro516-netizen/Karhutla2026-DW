import { NextResponse } from "next/server";
import { z } from "zod";

const RATE_LIMIT = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_REQ = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now > entry.reset) {
    RATE_LIMIT.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQ) return false;
  entry.count++;
  return true;
}

const StockBody = z.object({
  facilityId: z.string(),
  updates: z.record(z.string(), z.enum(["BANYAK", "MENIPIS", "HABIS"])),
  passcode: z.string(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  const body = StockBody.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const adminPasscode = process.env.ADMIN_PASSCODE;
  if (!adminPasscode || body.data.passcode !== adminPasscode) {
    return NextResponse.json({ error: "Passcode salah." }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(supabaseUrl, supabaseKey);
      const rows = Object.entries(body.data.updates).map(([item, level]) => ({
        facility_id: body.data.facilityId,
        item,
        level,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await sb.from("facility_stock").upsert(rows, { onConflict: "facility_id,item" });
      if (error) return NextResponse.json({ error: "Gagal menyimpan ke database." }, { status: 502 });
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "Gagal koneksi database." }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, demo: true });
}
