"use client";
import { id } from "@/i18n/id";

interface StaleBannerProps {
  updatedAt: string;
  onRetry: () => void;
}

export function StaleBanner({ updatedAt, onRetry }: StaleBannerProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
      <span>
        {id.ui.stale} {updatedAt})
      </span>
      <button onClick={onRetry} className="font-medium underline">
        {id.ui.retry}
      </button>
    </div>
  );
}
