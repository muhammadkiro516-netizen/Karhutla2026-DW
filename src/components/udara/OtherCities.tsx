"use client";
import { CITIES } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import type { AirCity } from "@/types/api";

interface OtherCitiesProps { allAir: AirCity[] | undefined }

export function OtherCities({ allAir }: OtherCitiesProps) {
  const { city, setCity } = useCity();

  const others = CITIES
    .filter(c => c.id !== city.id)
    .map(c => ({ ...c, air: allAir?.find(a => a.cityId === c.id) }))
    .sort((a, b) => (b.air?.ispuNow?.value ?? -1) - (a.air?.ispuNow?.value ?? -1));

  if (!others.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kondisi Kota Lain</p>
      {others.map(c => {
        const ispu = c.air?.ispuNow;
        return (
          <button key={c.id} onClick={() => setCity(c.id as CityId)}
            className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-px transition-all text-left w-full">
            <div>
              <p className="text-sm font-semibold text-slate-800">{c.name}</p>
              <p className="text-xs text-slate-400">{c.province}</p>
            </div>
            {ispu ? (
              <div className="text-right">
                <span className="block text-base font-black tabular-nums" style={{ color: ispu.color }}>
                  {ispu.value}
                </span>
                <span className="text-[10px] text-slate-400">{ispu.label}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-300">—</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
