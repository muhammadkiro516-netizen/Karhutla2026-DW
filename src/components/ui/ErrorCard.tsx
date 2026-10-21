"use client";
import { id } from "@/i18n/id";

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="rounded-[--radius-card] border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-center">
      <p className="text-red-700 dark:text-red-300 text-sm mb-2">
        {message ?? "Gagal memuat data."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-red-600 dark:text-red-400 underline"
        >
          {id.ui.retry}
        </button>
      )}
    </div>
  );
}
