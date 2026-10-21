"use client";
import { id } from "@/i18n/id";

interface ErrorCardProps { message?: string; onRetry?: () => void }

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="rounded-3xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 p-5 text-center">
      <p className="text-2xl mb-2">⚠️</p>
      <p className="text-red-700 dark:text-red-300 text-sm mb-3">{message ?? "Gagal memuat data."}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-4 py-2 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors">
          {id.ui.retry}
        </button>
      )}
    </div>
  );
}
