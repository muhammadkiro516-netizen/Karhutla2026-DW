"use client";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { AirCity } from "@/types/api";

/**
 * Derives a plain-language 24-h trend summary from the hourly series.
 * Splits the 48-h window into two halves of 24 h and compares median ISPU.
 */
function deriveTrend(hourly: AirCity["hourly"]) {
  const observed = hourly.filter(h => !h.forecast && h.ispu != null);
  if (observed.length < 6) return null;

  const values = observed.map(h => h.ispu as number);
  const mid = Math.floor(values.length / 2);
  const firstHalf = values.slice(0, mid);
  const secondHalf = values.slice(mid);

  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
  const first = avg(firstHalf);
  const second = avg(secondHalf);
  const diff = second - first;
  const pct = first > 0 ? Math.abs(diff / first) * 100 : 0;

  if (pct < 5) return { dir: "flat" as const, diff: 0, label: "Stabil" };
  if (diff > 0) return { dir: "up" as const, diff: Math.round(diff), label: `Naik ${Math.round(pct)}%` };
  return { dir: "down" as const, diff: Math.round(Math.abs(diff)), label: `Turun ${Math.round(pct)}%` };
}

function findPeakHour(hourly: AirCity["hourly"]): { time: string; ispu: number } | null {
  const obs = hourly.filter(h => !h.forecast && h.ispu != null);
  if (!obs.length) return null;
  const peak = obs.reduce((best, h) => (h.ispu! > best.ispu! ? h : best));
  return { time: peak.time.slice(11, 16), ispu: peak.ispu! };
}

function findLowHour(hourly: AirCity["hourly"]): { time: string; ispu: number } | null {
  const obs = hourly.filter(h => !h.forecast && h.ispu != null);
  if (!obs.length) return null;
  const low = obs.reduce((best, h) => (h.ispu! < best.ispu! ? h : best));
  return { time: low.time.slice(11, 16), ispu: low.ispu! };
}

function countHoursAbove(hourly: AirCity["hourly"], threshold: number): number {
  return hourly.filter(h => !h.forecast && (h.ispu ?? 0) > threshold).length;
}

interface AirTrendSummaryProps {
  air: AirCity | undefined;
}

export function AirTrendSummary({ air }: AirTrendSummaryProps) {
  if (!air || !air.hourly.length) return null;

  const trend = deriveTrend(air.hourly);
  const peak = findPeakHour(air.hourly);
  const low = findLowHour(air.hourly);
  const hoursUnhealthy = countHoursAbove(air.hourly, 100);
  const hoursDangerous = countHoursAbove(air.hourly, 200);
  const obsCount = air.hourly.filter(h => !h.forecast && h.ispu != null).length;

  const TrendIcon = trend?.dir === "up" ? TrendingUp : trend?.dir === "down" ? TrendingDown : Minus;
  const trendColor = trend?.dir === "up" ? "text-red-500" : trend?.dir === "down" ? "text-emerald-500" : "text-slate-400";

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Ringkasan 24 Jam Terakhir
      </p>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-2">
          <TrendIcon size={18} className={trendColor} />
          <span className={`text-sm font-bold ${trendColor}`}>{trend.label}</span>
          <span className="text-xs text-slate-400">dibanding 12 jam sebelumnya</span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Peak hour */}
        {peak && (
          <div className="rounded-2xl bg-red-50 border border-red-100 px-3 py-2.5">
            <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wide mb-0.5">
              Jam Terburuk
            </p>
            <p className="text-base font-black text-red-600 tabular-nums">{peak.time}</p>
            <p className="text-xs text-red-400">ISPU {peak.ispu}</p>
          </div>
        )}
        {/* Best hour */}
        {low && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
            <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide mb-0.5">
              Jam Terbaik
            </p>
            <p className="text-base font-black text-emerald-600 tabular-nums">{low.time}</p>
            <p className="text-xs text-emerald-400">ISPU {low.ispu}</p>
          </div>
        )}
        {/* Hours unhealthy */}
        <div className={`rounded-2xl px-3 py-2.5 ${hoursUnhealthy > 0 ? "bg-amber-50 border border-amber-100" : "bg-slate-50 border border-slate-100"}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-0.5 ${hoursUnhealthy > 0 ? "text-amber-400" : "text-slate-400"}`}>
            Jam Tidak Sehat
          </p>
          <p className={`text-base font-black tabular-nums ${hoursUnhealthy > 0 ? "text-amber-600" : "text-slate-600"}`}>
            {hoursUnhealthy}
          </p>
          <p className={`text-xs ${hoursUnhealthy > 0 ? "text-amber-400" : "text-slate-400"}`}>
            dari {obsCount} jam data
          </p>
        </div>
        {/* Hours dangerous */}
        <div className={`rounded-2xl px-3 py-2.5 ${hoursDangerous > 0 ? "bg-rose-50 border border-rose-100" : "bg-slate-50 border border-slate-100"}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-0.5 ${hoursDangerous > 0 ? "text-rose-400" : "text-slate-400"}`}>
            Jam Darurat
          </p>
          <p className={`text-base font-black tabular-nums ${hoursDangerous > 0 ? "text-rose-600" : "text-slate-600"}`}>
            {hoursDangerous}
          </p>
          <p className={`text-xs ${hoursDangerous > 0 ? "text-rose-400" : "text-slate-400"}`}>
            ISPU &gt; 200
          </p>
        </div>
      </div>

      {/* Best time to go outside today */}
      {low && (
        <div className="rounded-2xl bg-blue-50 border border-blue-100 px-3 py-2.5">
          <p className="text-xs font-semibold text-blue-700">
            Waktu terbaik keluar hari ini: sekitar pukul {low.time}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Berdasarkan ISPU terendah dalam 24 jam terakhir. Kondisi bisa berubah — pantau terus.
          </p>
        </div>
      )}

      <p className="text-[10px] text-slate-300 leading-relaxed">
        Sumber: Open-Meteo CAMS model atmosfer 40 km. Estimasi, bukan alat ukur langsung.
      </p>
    </div>
  );
}
