"use client";
import { id } from "@/i18n/id";

interface StaleBannerProps { updatedAt: string; onRetry: () => void }

export function StaleBanner({ updatedAt, onRetry }: StaleBannerProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-300">
      <span>{id.ui.stale} {updatedAt})</span>
      <button onClick={onRetry} className="font-semibold underline decoration-dotted">{id.ui.retry}</button>
    </div>
  );
}
