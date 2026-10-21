"use client";
import { Suspense } from "react";
import { CITIES } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import { Chip } from "@/components/ui/Chip";
import { id } from "@/i18n/id";

function CityChipsInner() {
  const { city, setCity, detectLocation } = useCity();
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none px-2 py-1">
      {CITIES.map((c) => (
        <Chip key={c.id} active={c.id === city.id} onClick={() => setCity(c.id as CityId)}>
          {c.name}
        </Chip>
      ))}
      <Chip onClick={detectLocation}>📍 {id.ui.useMyLocation}</Chip>
    </div>
  );
}

export function CityChips() {
  return (
    <Suspense fallback={
      <div className="flex gap-2 overflow-x-auto px-2 py-1">
        {CITIES.map(c => <span key={c.id} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-500 flex-shrink-0">{c.name}</span>)}
      </div>
    }>
      <CityChipsInner />
    </Suspense>
  );
}
