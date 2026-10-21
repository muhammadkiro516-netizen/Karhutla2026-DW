"use client";
import { useMemo } from "react";
import { StatusBadge } from "./StatusBadge";
import type { AirCity } from "@/types/api";
import type { City } from "@/config/cities";

interface TomorrowStripProps { air: AirCity | undefined; city: City }

export function TomorrowStrip({ air, city }: TomorrowStripProps) {
  const show = useMemo(() => {
    const hour = Number(new Intl.DateTimeFormat("id-ID", { timeZone: city.tz, hour: "numeric", hour12: false }).format(new Date()));
    return hour >= 18;
  }, [city.tz]);

  const tomorrow = air?.tomorrow;
  if (!show || !tomorrow) return null;

  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-sky-950/30 border border-blue-200 dark:border-blue-800/40 p-4 flex items-center justify-between gap-3 shadow-sm">
      <div>
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wide">
          Rekomendasi Besok ({tomorrow.window})
        </p>
        <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
          {tomorrow.date}
          {tomorrow.peakIspu != null ? ` • Puncak ISPU: ${tomorrow.peakIspu}` : ""}
        </p>
      </div>
      <StatusBadge status={tomorrow.status} size="sm" />
    </div>
  );
}
