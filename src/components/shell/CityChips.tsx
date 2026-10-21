"use client";
import { Suspense } from "react";
import { CITIES } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import { Chip } from "@/components/ui/Chip";
import { MapPin } from "lucide-react";

function CityChipsInner() {
  const { city, setCity, detectLocation } = useCity();
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none py-2.5">
      {CITIES.map(c => (
        <Chip key={c.id} active={c.id === city.id} onClick={() => setCity(c.id as CityId)}>
          {c.name}
        </Chip>
      ))}
      <Chip onClick={detectLocation} className="flex items-center gap-1.5 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
        <MapPin size={13} />
        Lokasi Saya
      </Chip>
    </div>
  );
}

export function CityChips() {
  return (
    <Suspense fallback={
      <div className="flex gap-2 overflow-x-auto py-2.5">
        {CITIES.map(c => <span key={c.id} className="px-4 py-1.5 rounded-full bg-slate-100 text-sm text-slate-400 whitespace-nowrap">{c.name}</span>)}
      </div>
    }>
      <CityChipsInner />
    </Suspense>
  );
}
