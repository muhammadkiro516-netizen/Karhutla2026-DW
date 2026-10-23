import { NextResponse } from "next/server";
import { getCity } from "@/config/cities";
import { pm25ToIspu } from "@/lib/ispu";

/**
 * GET /api/monthly?kota=<cityId>&months=3
 *
 * Returns per-month PM2.5 averages from Open-Meteo's historical endpoint.
 * Open-Meteo free tier: hourly PM2.5 up to 3 months back.
 * Aggregates into monthly buckets: { month, avgPm25, avgIspu, maxPm25, maxIspu, days }
 */

interface MonthBucket {
  month: string;       // "YYYY-MM"
  label: string;       // "Okt 2026"
  avgPm25: number;
  avgIspu: number;
  maxPm25: number;
  maxIspu: number;
  days: number;        // number of distinct days with data
  hoursAbove100: number;
  hoursAbove200: number;
}

const MONTH_LABELS_ID = [
  "Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"
];

function monthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return `${MONTH_LABELS_ID[parseInt(m, 10) - 1]} ${y}`;
}

// in-memory cache per city
const monthCache = new Map<string, { at: number; data: MonthBucket[] }>();
const MONTH_TTL = 3600 * 1000; // 1 hour

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kotaId = searchParams.get("kota");
  const monthsBack = Math.min(parseInt(searchParams.get("months") ?? "3", 10), 3);

  if (!kotaId) return NextResponse.json({ error: "kota required" }, { status: 400 });
  const city = getCity(kotaId);
  if (!city) return NextResponse.json({ error: "kota tidak ditemukan" }, { status: 400 });

  const cacheKey = `${kotaId}-${monthsBack}`;
  const cached = monthCache.get(cacheKey);
  if (cached && Date.now() - cached.at < MONTH_TTL) {
    return NextResponse.json({ data: cached.data, source: "Open-Meteo CAMS (cache)", cityId: kotaId });
  }

  // Date range: past N months
  const now = new Date();
  const endDate = now.toISOString().slice(0, 10);
  const startD = new Date(now);
  startD.setDate(startD.getDate() - monthsBack * 31 - 1);
  const startDate = startD.toISOString().slice(0, 10);

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&hourly=pm2_5&start_date=${startDate}&end_date=${endDate}&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json() as { hourly?: { time: string[]; pm2_5: (number|null)[] } };

    const times = raw.hourly?.time ?? [];
    const pm25s = raw.hourly?.pm2_5 ?? [];

    // Aggregate into monthly buckets
    const buckets = new Map<string, { sum: number; count: number; max: number; days: Set<string>; above100: number; above200: number }>();

    times.forEach((t, i) => {
      const val = pm25s[i];
      if (val == null || val < 0) return;
      const ym = t.slice(0, 7); // "YYYY-MM"
      const day = t.slice(0, 10);
      if (!buckets.has(ym)) buckets.set(ym, { sum: 0, count: 0, max: 0, days: new Set(), above100: 0, above200: 0 });
      const b = buckets.get(ym)!;
      b.sum += val;
      b.count++;
      if (val > b.max) b.max = val;
      b.days.add(day);
      const ispuVal = pm25ToIspu(val)?.value ?? 0;
      if (ispuVal > 100) b.above100++;
      if (ispuVal > 200) b.above200++;
    });

    const data: MonthBucket[] = [...buckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ym, b]) => {
        const avgPm25 = b.count > 0 ? Math.round(b.sum / b.count * 10) / 10 : 0;
        const maxPm25 = Math.round(b.max * 10) / 10;
        return {
          month: ym,
          label: monthLabel(ym),
          avgPm25,
          avgIspu: pm25ToIspu(avgPm25)?.value ?? 0,
          maxPm25,
          maxIspu: pm25ToIspu(maxPm25)?.value ?? 0,
          days: b.days.size,
          hoursAbove100: b.above100,
          hoursAbove200: b.above200,
        };
      });

    monthCache.set(cacheKey, { at: Date.now(), data });

    return NextResponse.json({
      data,
      source: "Open-Meteo CAMS historical",
      cityId: kotaId,
      fetchedAt: new Date().toISOString(),
    }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat data historis." }, { status: 502 });
  }
}
