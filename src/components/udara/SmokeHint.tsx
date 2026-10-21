import { Flame } from "lucide-react";
import { smokeHint } from "@/lib/attribution";
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
    <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1.5">
        <Flame size={15} className="text-orange-500 flex-shrink-0" />
        <p className="text-sm font-bold text-orange-700">Ada titik api di sekitar sini</p>
      </div>
      <p className="text-sm text-orange-700 leading-relaxed">{hint.message}</p>
      <p className="text-xs text-orange-400 mt-2">
        Titik api dari satelit — belum tentu kebakaran yang terkonfirmasi. Simulasi arah asap sangat sederhana.
      </p>
    </div>
  );
}
