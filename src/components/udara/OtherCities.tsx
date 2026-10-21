"use client";
import { CITIES } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import type { AirCity } from "@/types/api";

const CATEGORY_ICON: Record<string, string> = {
  BAIK: "🌿",
  SEDANG: "☁️",
  TIDAK_SEHAT: "😷",
  SANGAT_TIDAK_SEHAT: "⚠️",
  BERBAHAYA: "🔥",
};

interface OtherCitiesProps {
  allAir: AirCity[] | undefined;
}

export function OtherCities({ allAir }: OtherCitiesProps) {
  const { city, setCity } = useCity();

  const others = CITIES.filter((c) => c.id !== city.id)
    .map((c) => {
      const air = allAir?.find((a) => a.cityId === c.id);
      return { ...c, ispu: air?.ispuNow ?? null };
    })
    .sort((a, b) => (b.ispu?.value ?? -1) - (a.ispu?.value ?? -1));

  if (others.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
        Kota Lain
      </p>
      {others.map((c) => (
        <button
          key={c.id}
          onClick={() => setCity(c.id as CityId)}
          className="flex items-center justify-between rounded-2xl px-3 py-2.5 glass border border-white/40 dark:border-slate-700/40 hover:shadow-md hover:scale-[1.01] transition-all text-left w-full"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{CATEGORY_ICON[c.ispu?.category ?? ""] ?? "💨"}</span>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{c.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{c.province}</p>
            </div>
          </div>
          {c.ispu ? (
            <span
              className="text-white text-sm font-bold px-2.5 py-1 rounded-xl shadow-sm"
              style={{ backgroundColor: c.ispu.color }}
            >
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
