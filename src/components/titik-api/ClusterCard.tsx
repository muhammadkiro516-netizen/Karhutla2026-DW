import { CITIES } from "@/config/cities";
import { formatLocalTime } from "@/lib/hotspots";
import type { RichCluster } from "@/types/api";

const CONF_STYLE: Record<string, { dot: string; badge: string; color: string }> = {
  TINGGI: { dot: "bg-red-500", badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", color: "#DC2626" },
  SEDANG: { dot: "bg-orange-500", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", color: "#F97316" },
  RENDAH: { dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", color: "#EAB308" },
};

interface ClusterCardProps {
  cluster: RichCluster;
  highlightCityId?: string | null;
}

export function ClusterCard({ cluster, highlightCityId }: ClusterCardProps) {
  const city = CITIES.find(c => c.id === cluster.nearestCityId);
  const style = CONF_STYLE[cluster.confidence] ?? CONF_STYLE.RENDAH;
  const timeStr = city
    ? formatLocalTime(cluster.latestUtc, city.tz, city.tzLabel)
    : cluster.latestUtc.slice(11, 16) + " UTC";
  const cityDrift = highlightCityId
    ? cluster.drift.find(d => d.cityId === highlightCityId)
    : cluster.drift[0];
  const mapsUrl = `https://www.google.com/maps?q=${cluster.lat.toFixed(4)},${cluster.lon.toFixed(4)}`;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:-translate-y-px transition-all p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {cluster.confidence}
            </span>
            <span className="text-xs text-slate-400">{cluster.count} deteksi • FRP {cluster.maxFrp} MW</span>
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Dekat {city?.name ?? cluster.nearestCityId}
            <span className="text-slate-400 font-normal"> ({cluster.nearestKm} km)</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{timeStr} • {cluster.satellites.join(", ")}</p>
        </div>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="flex-shrink-0 text-xs font-medium text-blue-500 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg transition-colors">
          Maps ↗
        </a>
      </div>
      {cityDrift && (
        <div className="mt-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 px-3 py-2 text-xs text-orange-700 dark:text-orange-300">
          🌬 Asap menuju {CITIES.find(c => c.id === cityDrift.cityId)?.name ?? cityDrift.cityId}{" "}
          dalam <strong>{cityDrift.etaHours} jam</strong> ({cityDrift.distanceKm} km)
        </div>
      )}
    </div>
  );
}
