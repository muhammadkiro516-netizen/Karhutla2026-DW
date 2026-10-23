"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CITIES, cityIsland, type CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import { Search, MapPin, Check, X } from "lucide-react";

interface CitySearchProps {
  open: boolean;
  onClose: () => void;
}

type AnyCity = (typeof CITIES)[number];

export function CitySearch({ open, onClose }: CitySearchProps) {
  const { city, setCity } = useCity();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  // Portal needs document — only mount on client
  useEffect(() => setMounted(true), []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CITIES as readonly AnyCity[];
    return (CITIES as readonly AnyCity[]).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.province.toLowerCase().includes(q),
    );
  }, [query]);

  // Group by island, maintain stable order
  const ISLAND_ORDER = [
    "Sumatera", "Jawa", "Kalimantan",
    "Bali & Nusa Tenggara", "Sulawesi", "Maluku & Papua",
  ];
  const grouped = useMemo(() => {
    const map = new Map<string, AnyCity[]>();
    for (const c of filtered) {
      const island = cityIsland(c);
      if (!map.has(island)) map.set(island, []);
      map.get(island)!.push(c);
    }
    // Sort keys by ISLAND_ORDER
    const sorted = new Map<string, AnyCity[]>();
    for (const k of ISLAND_ORDER) if (map.has(k)) sorted.set(k, map.get(k)!);
    for (const [k, v] of map) if (!sorted.has(k)) sorted.set(k, v);
    return sorted;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  const handleSelect = (id: CityId) => {
    setCity(id);
    onClose();
  };

  if (!mounted || !open) return null;

  const modal = (
    // z-[200] beats nav (z-50) and chips (z-30)
    <div className="fixed inset-0 z-[200] flex flex-col items-stretch justify-end sm:items-center sm:justify-center px-0 sm:px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cari kota"
        className="relative z-10 w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: "85dvh" }}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-3 sm:pt-5">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              ref={inputRef}
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kota atau provinsi…"
              className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Tutup pencarian"
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4" />

        {/* Results list */}
        <div className="overflow-y-auto flex-1 pb-safe" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
              <Search size={32} strokeWidth={1.5} />
              <p className="text-sm">Kota tidak ditemukan</p>
              <p className="text-xs">Coba kata kunci lain</p>
            </div>
          ) : (
            [...grouped.entries()].map(([island, cities]) => (
              <div key={island}>
                {/* Island group header */}
                <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-2 mt-2">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {island}
                  </span>
                </div>

                {/* City rows */}
                {cities.map((c) => {
                  const active = c.id === city.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(c.id as CityId)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                        ${active
                          ? "bg-blue-50 dark:bg-blue-950/40"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full
                        ${active ? "bg-blue-100 dark:bg-blue-900/50" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <MapPin size={14} className={active ? "text-blue-500" : "text-slate-400"} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate
                          ${active ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-slate-100"}`}>
                          {c.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{c.province}</p>
                      </div>

                      {/* Active check */}
                      {active && (
                        <Check size={16} className="text-blue-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
          {/* Bottom padding for safe area */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
