"use client";
import type { StockLevel } from "@/data/seed";

const COLOR: Record<StockLevel, string> = {
  BANYAK:  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  MENIPIS: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  HABIS:   "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

interface StockEntry { item: string; level: StockLevel; stale?: boolean }
interface StockChipsProps { stock: StockEntry[]; facilityName: string }

export function StockChips({ stock, facilityName }: StockChipsProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-slate-400">{facilityName}</p>
      <div className="flex flex-wrap gap-1.5">
        {stock.map(s => (
          <span key={s.item}
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${COLOR[s.level]} ${s.stale ? "opacity-50" : ""}`}>
            {s.item}: {s.level.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
