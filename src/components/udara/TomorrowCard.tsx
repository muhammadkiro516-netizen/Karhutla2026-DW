"use client";
import { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { ISPU_META } from "@/lib/ispu";
import type { TomorrowForecast } from "@/types/api";
import type { City } from "@/config/cities";

function localHour(tz: string): number {
  return Number(new Intl.DateTimeFormat("id-ID", { timeZone: tz, hour: "numeric", hour12: false }).format(new Date()));
}

function peakColor(peakIspu: number | null): string {
  if (peakIspu == null) return "#94a3b8";
  if (peakIspu <= 50)  return ISPU_META.BAIK.color;
  if (peakIspu <= 100) return ISPU_META.SEDANG.color;
  if (peakIspu <= 200) return ISPU_META.TIDAK_SEHAT.color;
  if (peakIspu <= 300) return ISPU_META.SANGAT_TIDAK_SEHAT.color;
  return ISPU_META.BERBAHAYA.color;
}

interface TomorrowCardProps { tomorrow: TomorrowForecast | null | undefined; city: City }

export function TomorrowCard({ tomorrow, city }: TomorrowCardProps) {
  const show = useMemo(() => localHour(city.tz) >= 18, [city.tz]);
  if (!show || !tomorrow) return null;

  return (
    <div className="mt-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-sky-600 dark:text-sky-400 font-medium uppercase tracking-wide">
            Rekomendasi Besok ({tomorrow.window})
          </p>
          <p className="text-sm font-semibold mt-0.5 text-slate-700 dark:text-slate-200">{tomorrow.date}</p>
        </div>
        <Badge label={tomorrow.status.label} color={peakColor(tomorrow.peakIspu)} />
      </div>
      {tomorrow.peakIspu != null && (
        <p className="text-xs text-slate-400 mt-1.5">Puncak ISPU prakiraan: {tomorrow.peakIspu}</p>
      )}
    </div>
  );
}
