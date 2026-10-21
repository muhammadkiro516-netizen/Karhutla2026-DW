"use client";
import { CITIES } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import type { AirCity } from "@/types/api";

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
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        Kota Lain
      </p>
      {others.map((c) => (
        <button
          key={c.id}
          onClick={() => setCity(c.id as CityId)}
          className="flex items-center justify-between rounded-xl px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left w-full"
        >
          <div>
            <p className="text-sm font-medium">{c.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.province}</p>
          </div>
          {c.ispu ? (
            <span
              className="text-white text-sm font-bold px-2 py-1 rounded-lg"
              style={{ backgroundColor: c.ispu.color }}
            >
              {c.ispu.value}
            </span>
          ) : (
            <span className="text-xs text-zinc-400">—</span>
          )}
        </button>
      ))}
    </div>
  );
}
