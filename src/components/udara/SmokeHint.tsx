import { smokeHint } from "@/lib/attribution";
import { id } from "@/i18n/id";
import type { HotspotPayload, AirCity } from "@/types/api";

interface SmokeHintProps {
  hotspots: HotspotPayload | undefined;
  air: AirCity | undefined;
  cityId: string;
}

export function SmokeHint({ hotspots, air, cityId }: SmokeHintProps) {
  const cityThreat = hotspots?.threat.find((t) => t.cityId === cityId);
  const nearestClusterKm =
    hotspots?.clusters[0]?.nearestCityId === cityId
      ? hotspots.clusters[0].nearestKm
      : null;
  const pm25Last6h = (air?.hourly ?? [])
    .filter((h) => !h.forecast)
    .slice(-6)
    .map((h) => h.pm25);

  const hint = smokeHint({ cityThreat, nearestClusterKm, pm25Last6h });
  if (!hint.show) return null;

  return (
    <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3 text-sm text-orange-800 dark:text-orange-200">
      <p className="font-medium mb-0.5">🔥 Potensi asap</p>
      <p>{hint.message}</p>
      <p className="text-xs mt-1 opacity-70">
        {id.disclaimer.hotspot} {id.disclaimer.drift}
      </p>
    </div>
  );
}
