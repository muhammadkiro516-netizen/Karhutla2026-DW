"use client";
import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ISPU_META } from "@/lib/ispu";
import type { TomorrowForecast } from "@/types/api";
import type { City } from "@/config/cities";

interface TomorrowCardProps {
  tomorrow: TomorrowForecast | null | undefined;
  city: City;
}

function localHour(tz: string): number {
  return Number(
    new Intl.DateTimeFormat("id-ID", {
      timeZone: tz,
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
  );
}

function peakColor(peakIspu: number | null): string {
  if (peakIspu == null) return "#6b7280";
  if (peakIspu <= 50) return ISPU_META.BAIK.color;
  if (peakIspu <= 100) return ISPU_META.SEDANG.color;
  if (peakIspu <= 200) return ISPU_META.TIDAK_SEHAT.color;
  if (peakIspu <= 300) return ISPU_META.SANGAT_TIDAK_SEHAT.color;
  return ISPU_META.BERBAHAYA.color;
}

export function TomorrowCard({ tomorrow, city }: TomorrowCardProps) {
  const show = useMemo(() => localHour(city.tz) >= 18, [city.tz]);

  if (!show || !tomorrow) return null;

  return (
    <Card className="mt-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Rekomendasi Besok ({tomorrow.window})
          </p>
          <p className="text-sm font-semibold mt-0.5">{tomorrow.date}</p>
        </div>
        <Badge label={tomorrow.status.label} color={peakColor(tomorrow.peakIspu)} />
      </div>
      {tomorrow.peakIspu != null && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Puncak ISPU prakiraan: {tomorrow.peakIspu}
        </p>
      )}
    </Card>
  );
}
