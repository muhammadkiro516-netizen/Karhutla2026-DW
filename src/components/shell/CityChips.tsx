"use client";
import { Suspense, useState } from "react";
import { POPULAR_CITIES } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import { Chip } from "@/components/ui/Chip";
import { MapPin, Search } from "lucide-react";
import { CitySearch } from "./CitySearch";

function CityChipsInner() {
  const { city, setCity, detectLocation } = useCity();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto scrollbar-none py-2.5 items-center">
        {POPULAR_CITIES.map((c) => (
          <Chip key={c.id} active={c.id === city.id} onClick={() => setCity(c.id as CityId)}>
            {c.name}
          </Chip>
        ))}
        {/* Active city if not in popular list — show it too */}
        {!POPULAR_CITIES.some((c) => c.id === city.id) && (
          <Chip active onClick={() => setSearchOpen(true)}>
            {city.name}
          </Chip>
        )}
        <Chip
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-1.5 text-slate-600 border-slate-300 bg-slate-50 hover:bg-slate-100"
        >
          <Search size={13} />
          Cari
        </Chip>
        <Chip
          onClick={detectLocation}
          className="flex items-center gap-1.5 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
        >
          <MapPin size={13} />
          Lokasi Saya
        </Chip>
      </div>

      <CitySearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export function CityChips() {
  return (
    <Suspense
      fallback={
        <div className="flex gap-2 overflow-x-auto py-2.5">
          {POPULAR_CITIES.map((c) => (
            <span
              key={c.id}
              className="px-4 py-1.5 rounded-full bg-slate-100 text-sm text-slate-400 whitespace-nowrap"
            >
              {c.name}
            </span>
          ))}
        </div>
      }
    >
      <CityChipsInner />
    </Suspense>
  );
}
