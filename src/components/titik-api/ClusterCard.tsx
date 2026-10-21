import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CITIES } from "@/config/cities";
import { formatLocalTime } from "@/lib/hotspots";
import type { RichCluster } from "@/types/api";

const CONF_COLOR: Record<string, string> = {
  TINGGI: "#DC2626",
  SEDANG: "#F97316",
  RENDAH: "#EAB308",
};
const CONF_LABEL: Record<string, string> = {
  TINGGI: "Tinggi",
  SEDANG: "Sedang",
  RENDAH: "Rendah",
};

interface ClusterCardProps {
  cluster: RichCluster;
  highlightCityId?: string | null;
}

export function ClusterCard({ cluster, highlightCityId }: ClusterCardProps) {
  const city = CITIES.find(c => c.id === cluster.nearestCityId);
  const timeStr = city
    ? formatLocalTime(cluster.latestUtc, city.tz, city.tzLabel)
    : cluster.latestUtc.slice(11, 16) + " UTC";
  const cityDrift = highlightCityId
    ? cluster.drift.find(d => d.cityId === highlightCityId)
    : cluster.drift[0];
  const mapsUrl = `https://www.google.com/maps?q=${cluster.lat.toFixed(4)},${cluster.lon.toFixed(4)}`;

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              label={CONF_LABEL[cluster.confidence] ?? cluster.confidence}
              color={CONF_COLOR[cluster.confidence]}
            />
            <span className="text-xs text-zinc-500">
              {cluster.count} deteksi • FRP {cluster.maxFrp} MW
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-0.5">
            Dekat {city?.name ?? cluster.nearestCityId} ({cluster.nearestKm} km) • {timeStr}
          </p>
          {cluster.satellites.length > 0 && (
            <p className="text-xs text-zinc-400 mt-0.5">{cluster.satellites.join(", ")}</p>
          )}
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline flex-shrink-0"
        >
          Peta ↗
        </a>
      </div>
      {cityDrift && (
        <p className="text-xs text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 rounded px-2 py-1">
          🌬 Asap menuju{" "}
          {CITIES.find(c => c.id === cityDrift.cityId)?.name ?? cityDrift.cityId} dalam{" "}
          {cityDrift.etaHours} jam ({cityDrift.distanceKm} km)
        </p>
      )}
    </Card>
  );
}
