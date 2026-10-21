"use client";
import { id } from "@/i18n/id";
import type { DecisionEntry } from "@/lib/audit";

export function AuditLog({ log, chainValid }: { log: DecisionEntry[]; chainValid: boolean | null }) {
  if (!log.length) {
    return <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada keputusan resmi.</p>;
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Log Keputusan</p>
        {chainValid === true && <span className="text-xs text-emerald-600 dark:text-emerald-400">{id.ui.logIntact}</span>}
        {chainValid === false && <span className="text-xs text-red-500">{id.ui.logBroken}</span>}
      </div>
      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
        {[...log].reverse().map(entry => (
          <div key={entry.hash} className="text-xs bg-slate-50 dark:bg-slate-700/50 rounded-2xl px-3 py-2.5">
            <div className="flex justify-between gap-2">
              <span className="font-semibold truncate text-slate-700 dark:text-slate-200">{entry.school}</span>
              <span className="text-slate-400 flex-shrink-0">{new Date(entry.at).toLocaleString("id-ID")}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Mesin: {entry.recommended} → <span className="font-semibold text-slate-700 dark:text-slate-200">{entry.decided}</span>
              {entry.note && ` • ${entry.note}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
