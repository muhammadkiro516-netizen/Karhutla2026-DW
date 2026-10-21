"use client";
import { CITIES } from "@/config/cities";
import type { HotspotPayload } from "@/types/api";

interface ThreatRankingProps {
  payload: HotspotPayload | undefined;
  activeCityId: string | null;
  onSelectCity: (id: string | null) => void;
}

export function ThreatRanking({ payload, activeCityId, onSelectCity }: ThreatRankingProps) {
  const threat = payload?.threat ?? [];
  if (threat.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        Ancaman Terhadap Kota
      </p>
      <div className="flex flex-col gap-1">
        {threat.map(t => {
          const city = CITIES.find(c => c.id === t.cityId);
          const active = activeCityId === t.cityId;
          return (
            <button
              key={t.cityId}
              onClick={() => onSelectCity(active ? null : t.cityId)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors text-sm ${active ? "bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700" : "bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"}`}
            >
              <span className="font-medium">{city?.name ?? t.cityId}</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                {t.clusters} klaster
                {t.earliestEtaHours != null ? ` • ETA ${t.earliestEtaHours} jam` : ""}
              </span>
            </button>
          );
        })}
      </div>
      {activeCityId && (
        <button onClick={() => onSelectCity(null)} className="text-xs text-zinc-400 underline self-start">
          Hapus filter kota
        </button>
      )}
    </div>
  );
}
