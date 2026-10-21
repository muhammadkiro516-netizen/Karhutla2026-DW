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
  if (!threat.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Ancaman Terhadap Kota</p>
      <div className="flex flex-col gap-1.5">
        {threat.map(t => {
          const city = CITIES.find(c => c.id === t.cityId);
          const active = activeCityId === t.cityId;
          return (
            <button key={t.cityId} onClick={() => onSelectCity(active ? null : t.cityId)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-left transition-all text-sm ${
                active
                  ? "bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 shadow-sm"
                  : "bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 border border-slate-100 dark:border-slate-600"
              }`}>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{city?.name ?? t.cityId}</span>
              <span className="text-slate-400 text-xs">
                {t.clusters} klaster{t.earliestEtaHours != null ? ` • ETA ${t.earliestEtaHours}j` : ""}
              </span>
            </button>
          );
        })}
      </div>
      {activeCityId && (
        <button onClick={() => onSelectCity(null)} className="text-xs text-blue-400 hover:text-blue-600 underline decoration-dotted self-start">
          Hapus filter kota
        </button>
      )}
    </div>
  );
}
