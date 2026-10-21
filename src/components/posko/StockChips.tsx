"use client";
import type { StockLevel } from "@/data/seed";

const COLOR: Record<StockLevel, string> = {
  BANYAK: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  MENIPIS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  HABIS: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

interface StockEntry { item: string; level: StockLevel; stale?: boolean }
interface StockChipsProps { stock: StockEntry[]; facilityName: string }

export function StockChips({ stock, facilityName }: StockChipsProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{facilityName}</p>
      <div className="flex flex-wrap gap-1.5">
        {stock.map(s => (
          <span
            key={s.item}
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${COLOR[s.level]} ${s.stale ? "opacity-50" : ""}`}
          >
            {s.item}: {s.level.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
