"use client";
import { useMemo, useState } from "react";
import { CITIES, cityIsland, type CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import { Search, MapPin, Check } from "lucide-react";

interface CitySearchProps {
  open: boolean;
  onClose: () => void;
}

export function CitySearch({ open, onClose }: CitySearchProps) {
  const { city, setCity } = useCity();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CITIES;
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.province.toLowerCase().includes(q),
    );
  }, [query]);

  // Group by island
  const grouped = useMemo(() => {
    const map = new Map<string, typeof CITIES>();
    for (const c of filtered) {
      const island = cityIsland(c);
      if (!map.has(island)) map.set(island, [] as unknown as typeof CITIES);
      (map.get(island) as unknown as typeof CITIES[number][]).push(c);
    }
    return map;
  }, [filtered]);

  if (!open) return null;

  const handleSelect = (id: CityId) => {
    setCity(id);
    setQuery("");
    onClose();
  };

  const inputId = "city-search-input";

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-800 rounded-t-3xl lg:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700/50 max-h-[80dvh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/50">
          <h2 className="text-base font-semibold mb-3">Cari Kota</h2>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id={inputId}
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik nama kota atau provinsi…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-slate-50 dark:bg-slate-700/50 text-sm border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 px-2 py-2">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-8">
              Kota tidak ditemukan. Coba kata kunci lain.
            </p>
          )}
          {[...grouped.entries()].map(([island, cities]) => (
            <div key={island} className="mb-2">
              <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {island}
              </p>
              {(cities as readonly (typeof CITIES)[number][]).map((c) => {
                const active = c.id === city.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id as CityId)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <MapPin
                      size={15}
                      className={active ? "text-blue-500" : "text-slate-300"}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {c.province}
                      </p>
                    </div>
                    {active && <Check size={15} className="text-blue-500" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
