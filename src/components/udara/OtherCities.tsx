"use client";
import { CITIES } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import type { AirCity } from "@/types/api";

const CAT_EMOJI: Record<string, string> = {
  BAIK: "🌿", SEDANG: "🌤️", TIDAK_SEHAT: "😷",
  SANGAT_TIDAK_SEHAT: "⚠️", BERBAHAYA: "🔥",
};

interface OtherCitiesProps { allAir: AirCity[] | undefined }

export function OtherCities({ allAir }: OtherCitiesProps) {
  const { city, setCity } = useCity();

  const others = CITIES
    .filter(c => c.id !== city.id)
    .map(c => ({ ...c, ispu: allAir?.find(a => a.cityId === c.id)?.ispuNow ?? null }))
    .sort((a, b) => (b.ispu?.value ?? -1) - (a.ispu?.value ?? -1));

  if (!others.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-1">Kota Lain</p>
      {others.map(c => (
        <button key={c.id} onClick={() => setCity(c.id as CityId)}
          className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:-translate-y-px transition-all text-left w-full">
          <div className="flex items-center gap-3">
            <span className="text-xl">{CAT_EMOJI[c.ispu?.category ?? ""] ?? "💨"}</span>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{c.name}</p>
              <p className="text-xs text-slate-400">{c.province}</p>
            </div>
          </div>
          {c.ispu ? (
            <span className="text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-sm"
              style={{ backgroundColor: c.ispu.color }}>
              {c.ispu.value}
            </span>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </button>
      ))}
    </div>
  );
}
