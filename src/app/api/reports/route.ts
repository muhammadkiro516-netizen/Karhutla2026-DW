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

const ReportBody = z.object({
  cityId: z.string(),
  description: z.string().max(500),
  evidenceHash: z.string().optional(),
  status: z.enum(["TERVERIFIKASI", "SEBAGIAN", "TIDAK_SESUAI", "BELUM_TERVERIFIKASI"]),
  reportId: z.string(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  const body = ReportBody.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const { cityId, description, evidenceHash, status, reportId } = body.data;
  // Never store raw GPS — only metadata
  const payload = {
    cityId,
    description: description.slice(0, 500),
    evidenceHash,
    status,
    reportId,
    at: new Date().toISOString(),
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(supabaseUrl, supabaseKey);
      const { error } = await sb.from("reports").insert(payload);
      if (error) return NextResponse.json({ error: "Gagal menyimpan." }, { status: 502 });
      return NextResponse.json({ ok: true, reportId });
    } catch {
      return NextResponse.json({ error: "Gagal koneksi." }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, demo: true, reportId });
}
