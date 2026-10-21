"use client";
import { useModes } from "@/hooks/useModes";
import { id } from "@/i18n/id";

export function ModeBanner() {
  const { vulnerable, lowData } = useModes();
  const active = [
    vulnerable && id.modes.vulnerable,
    lowData && id.modes.lowData,
  ].filter(Boolean) as string[];

  if (active.length === 0) return null;

  return (
    <div className="flex gap-2 px-4 py-1 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
      {active.map((m) => (
        <span
          key={m}
          className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full"
        >
          {m}
        </span>
      ))}
    </div>
  );
}
