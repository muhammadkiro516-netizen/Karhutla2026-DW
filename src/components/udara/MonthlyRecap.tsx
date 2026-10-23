"use client";
/**
 * MonthlyRecap — shows real per-month PM2.5/ISPU averages from Open-Meteo history.
 * Data is genuinely historical (from the CAMS API, not hardcoded).
 * Up to 3 months back, refreshed every hour.
 */
import useSWR from "swr";
import { TrendingDown, TrendingUp, Minus, Calendar } from "lucide-react";

interface MonthBucket {
  month: string;
  label: string;
  avgPm25: number;
  avgIspu: number;
  maxPm25: number;
  maxIspu: number;
  days: number;
  hoursAbove100: number;
  hoursAbove200: number;
}

interface MonthlyResponse {
  data: MonthBucket[];
  source: string;
  cityId: string;
  fetchedAt: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json() as Promise<MonthlyResponse>);

function ispuColor(ispu: number): string {
  if (ispu <= 50)  return "#16a34a";
  if (ispu <= 100) return "#2563eb";
  if (ispu <= 200) return "#d97706";
  if (ispu <= 300) return "#dc2626";
  return "#0f172a";
}
function ispuBg(ispu: number): string {
  if (ispu <= 50)  return "bg-emerald-50 border-emerald-100";
  if (ispu <= 100) return "bg-blue-50 border-blue-100";
  if (ispu <= 200) return "bg-amber-50 border-amber-100";
  if (ispu <= 300) return "bg-red-50 border-red-100";
  return "bg-gray-100 border-gray-200";
}
function ispuLabel(ispu: number): string {
  if (ispu <= 50)  return "Baik";
  if (ispu <= 100) return "Sedang";
  if (ispu <= 200) return "Tidak Sehat";
  if (ispu <= 300) return "Sgt Tdk Sehat";
  return "Berbahaya";
}

export function MonthlyRecap({ cityId }: { cityId: string }) {
  const { data: resp, isLoading, error } = useSWR<MonthlyResponse>(
    `/api/monthly?kota=${cityId}&months=3`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 3600_000 },
  );

  if (isLoading) return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 animate-pulse">
      <div className="h-4 bg-slate-100 rounded w-40 mb-4" />
      <div className="grid grid-cols-3 gap-3">
        {[0,1,2].map(i => <div key={i} className="h-28 bg-slate-50 rounded-2xl" />)}
      </div>
    </div>
  );

  if (error || !resp?.data?.length) return null;

  const months = resp.data.slice(-3); // last 3 months
  const latest = months[months.length - 1];
  const prev   = months[months.length - 2];
  const trend  = prev && latest
    ? latest.avgIspu > prev.avgIspu + 5 ? "up"
    : latest.avgIspu < prev.avgIspu - 5 ? "down"
    : "flat"
    : "flat";

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-red-500" : trend === "down" ? "text-emerald-500" : "text-slate-400";
  const trendLabel = trend === "up" ? "Memburuk dari bulan lalu" : trend === "down" ? "Membaik dari bulan lalu" : "Stabil dari bulan lalu";

  // Bar chart max
  const maxAvg = Math.max(...months.map(m => m.avgIspu), 50);

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Rekap Bulanan</p>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendIcon size={14} className={trendColor} />
          <span className={`text-xs font-semibold ${trendColor}`}>{trendLabel}</span>
        </div>
      </div>

      {/* Month cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {months.map((m, i) => {
          const isLatest = i === months.length - 1;
          const color = ispuColor(m.avgIspu);
          return (
            <div key={m.month}
              className={`rounded-2xl border p-3 flex flex-col gap-2 transition-all ${ispuBg(m.avgIspu)} ${isLatest ? "ring-2 ring-offset-1 ring-current" : ""}`}>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{m.label}</p>
                {isLatest && <span className="text-[9px] bg-slate-800 text-white px-1.5 py-0.5 rounded-full font-bold">Terbaru</span>}
              </div>
              {/* Avg ISPU */}
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Rata-rata ISPU</p>
                <p className="text-xl font-black tabular-nums leading-tight" style={{ color }}>
                  {m.avgIspu}
                </p>
                <p className="text-[10px] font-semibold" style={{ color }}>{ispuLabel(m.avgIspu)}</p>
              </div>
              {/* Bar */}
              <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(m.avgIspu / maxAvg) * 100}%`, background: color }} />
              </div>
              {/* Sub stats */}
              <div className="flex flex-col gap-0.5">
                <p className="text-[9px] text-slate-400">Maks: <span className="font-bold text-slate-600">{m.maxIspu}</span></p>
                <p className="text-[9px] text-slate-400">PM2.5 avg: <span className="font-bold text-slate-600">{m.avgPm25} µg</span></p>
                {m.hoursAbove100 > 0 && (
                  <p className="text-[9px] text-amber-500 font-semibold">{m.hoursAbove100}j tdk sehat</p>
                )}
                {m.hoursAbove200 > 0 && (
                  <p className="text-[9px] text-red-500 font-semibold">{m.hoursAbove200}j darurat</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison sentence */}
      {prev && latest && (
        <div className={`rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
          trend === "up" ? "bg-red-50 border border-red-100 text-red-700"
          : trend === "down" ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
          : "bg-slate-50 border border-slate-100 text-slate-600"
        }`}>
          {trend === "up" && `⚠️ Kualitas udara bulan ini (rata-rata ISPU ${latest.avgIspu}) lebih buruk ${latest.avgIspu - prev.avgIspu} poin dari ${prev.label} (${prev.avgIspu}).`}
          {trend === "down" && `✅ Kualitas udara membaik ${prev.avgIspu - latest.avgIspu} poin dari ${prev.label} (${prev.avgIspu}) ke ${latest.label} (${latest.avgIspu}).`}
          {trend === "flat" && `📊 Kualitas udara relatif stabil antara ${prev.label} (${prev.avgIspu}) dan ${latest.label} (${latest.avgIspu}).`}
        </div>
      )}

      <p className="text-[10px] text-slate-300 leading-relaxed">
        Sumber: Open-Meteo CAMS historis · Data realtime diperbarui setiap jam · Estimasi model atmosfer 40 km
      </p>
    </div>
  );
}
