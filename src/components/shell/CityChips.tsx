"use client";
import { Suspense, useState } from "react";
import { POPULAR_CITIES, CITIES } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import { MapPin, Search, ChevronDown } from "lucide-react";
import { CitySearch } from "./CitySearch";

function CityChipsInner() {
  const { city, setCity, detectLocation } = useCity();
  const [searchOpen, setSearchOpen] = useState(false);

  const quickCities = POPULAR_CITIES
    .filter(c => c.id !== city.id)
    .slice(0, 6);

  const isPopular = POPULAR_CITIES.some(c => c.id === city.id);

  return (
    <>
      <div className="flex items-center gap-2 py-2">
        {/* Active city pill */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 min-w-0 flex-shrink-0 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 pl-3 pr-2.5 py-2 hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors group"
        >
          <MapPin size={12} className="text-orange-400 dark:text-orange-500 flex-shrink-0" />
          <div className="min-w-0 text-left">
            <p className="text-sm font-black leading-tight truncate max-w-[120px]">{city.name}</p>
            <p className="text-[10px] text-white/50 dark:text-slate-900/50 leading-none truncate max-w-[120px]">{city.province}</p>
          </div>
          <ChevronDown size={12} className="text-white/40 dark:text-slate-900/40 flex-shrink-0 group-hover:text-white/70 dark:group-hover:text-slate-900/70 transition-colors" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

        {/* Quick-access cities */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none flex-1 min-w-0">
          {quickCities.map(c => (
            <button
              key={c.id}
              onClick={() => setCity(c.id as CityId)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-px"
            >
              {c.name}
            </button>
          ))}
          {!isPopular && (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              + kota lain
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

        {/* Right controls */}
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Cari kota"
          >
            <Search size={13} />
            <span className="text-xs font-semibold hidden sm:block">Cari</span>
          </button>
          <button
            onClick={detectLocation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            aria-label="Gunakan lokasi saya"
          >
            <MapPin size={13} />
            <span className="text-xs font-semibold hidden sm:block">Lokasi</span>
          </button>
        </div>
      </div>

      {/* Total city count */}
      <div className="pb-1">
        <p className="text-[10px] text-slate-400 dark:text-slate-600 text-right pr-1">
          {CITIES.length} kota tersedia
        </p>
      </div>

      <CitySearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export function CityChips() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 py-2">
          <div className="h-9 w-36 rounded-2xl bg-slate-900/10 dark:bg-slate-100/10 animate-pulse" />
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div className="flex gap-1.5 flex-1">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-7 w-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <CityChipsInner />
    </Suspense>
  );
}
