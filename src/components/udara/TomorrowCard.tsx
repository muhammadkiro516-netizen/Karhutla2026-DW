"use client";
import { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { ISPU_META } from "@/lib/ispu";
import type { TomorrowForecast } from "@/types/api";
import type { City } from "@/config/cities";

function localHour(tz: string) {
  return Number(new Intl.DateTimeFormat("id-ID", { timeZone: tz, hour: "numeric", hour12: false }).format(new Date()));
}

function peakColor(v: number | null) {
  if (v == null) return "#94a3b8";
  if (v <= 50) return ISPU_META.BAIK.color;
  if (v <= 100) return ISPU_META.SEDANG.color;
  if (v <= 200) return ISPU_META.TIDAK_SEHAT.color;
  if (v <= 300) return ISPU_META.SANGAT_TIDAK_SEHAT.color;
  return ISPU_META.BERBAHAYA.color;
}

const STATUS_LABELS: Record<string, string> = {
  NORMAL: "Aman", WASPADA: "Hati-hati", HYBRID: "Waspada", DARING_DARURAT: "Darurat",
};

interface TomorrowCardProps { tomorrow: TomorrowForecast | null | undefined; city: City }

export function TomorrowCard({ tomorrow, city }: TomorrowCardProps) {
  const show = useMemo(() => localHour(city.tz) >= 18, [city.tz]);
  if (!show || !tomorrow) return null;

  const color = peakColor(tomorrow.peakIspu);
  const label = STATUS_LABELS[tomorrow.status.code] ?? tomorrow.status.label;

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
          <CalendarDays size={18} className="text-slate-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Prakiraan besok ({tomorrow.window})</p>
          <p className="text-sm font-semibold text-slate-800">{tomorrow.date}</p>
          {tomorrow.peakIspu != null && (
            <p className="text-xs text-slate-400">Puncak debu: {tomorrow.peakIspu}</p>
          )}
        </div>
      </div>
      <span className="text-sm font-bold px-3 py-1.5 rounded-xl text-white flex-shrink-0" style={{ backgroundColor: color }}>
        {label}
      </span>
    </div>
  );
}
