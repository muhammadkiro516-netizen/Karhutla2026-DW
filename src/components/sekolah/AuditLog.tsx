"use client";
import { id } from "@/i18n/id";
import type { DecisionEntry } from "@/lib/audit";

interface AuditLogProps {
  log: DecisionEntry[];
  chainValid: boolean | null;
}

export function AuditLog({ log, chainValid }: AuditLogProps) {
  if (log.length === 0) {
    return (
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Belum ada keputusan resmi.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Log Keputusan
        </p>
        {chainValid === true && (
          <span className="text-xs text-green-600 dark:text-green-400">
            {id.ui.logIntact}
          </span>
        )}
        {chainValid === false && (
          <span className="text-xs text-red-500">{id.ui.logBroken}</span>
        )}
      </div>
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {[...log].reverse().map((entry) => (
          <div
            key={entry.hash}
            className="text-xs bg-zinc-50 dark:bg-zinc-800 rounded-lg px-3 py-2"
          >
            <div className="flex justify-between gap-2">
              <span className="font-medium truncate">{entry.school}</span>
              <span className="text-zinc-400 flex-shrink-0">
                {new Date(entry.at).toLocaleString("id-ID")}
              </span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
              Mesin: {entry.recommended} → Diputuskan:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-200">
                {entry.decided}
              </span>
              {entry.note && ` • ${entry.note}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
