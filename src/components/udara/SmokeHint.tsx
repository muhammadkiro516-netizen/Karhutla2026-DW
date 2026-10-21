import { smokeHint } from "@/lib/attribution";
import { id } from "@/i18n/id";
import type { HotspotPayload, AirCity } from "@/types/api";

interface SmokeHintProps {
  hotspots: HotspotPayload | undefined;
  air: AirCity | undefined;
  cityId: string;
}

export function SmokeHint({ hotspots, air, cityId }: SmokeHintProps) {
  const cityThreat = hotspots?.threat.find(t => t.cityId === cityId);
  const nearestClusterKm =
    hotspots?.clusters[0]?.nearestCityId === cityId
      ? hotspots.clusters[0].nearestKm : null;
  const pm25Last6h = (air?.hourly ?? []).filter(h => !h.forecast).slice(-6).map(h => h.pm25);
  const hint = smokeHint({ cityThreat, nearestClusterKm, pm25Last6h });
  if (!hint.show) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border border-orange-200 dark:border-orange-800/50 p-4 shadow-sm">
      <p className="font-semibold text-orange-700 dark:text-orange-300 mb-1">🔥 Potensi asap</p>
      <p className="text-sm text-orange-700 dark:text-orange-300">{hint.message}</p>
      <p className="text-xs mt-2 text-orange-500 dark:text-orange-500">
        {id.disclaimer.hotspot} {id.disclaimer.drift}
      </p>
    </div>
  );
}
