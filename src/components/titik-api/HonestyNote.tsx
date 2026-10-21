import { id } from "@/i18n/id";

export function HonestyNote() {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 p-4 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
      <p className="font-semibold text-slate-600 dark:text-slate-300">Catatan keterbatasan</p>
      <p>• {id.disclaimer.hotspot}</p>
      <p>• {id.disclaimer.drift}</p>
      <p>• Klaster adalah perkiraan lokasi, bukan titik presisi.</p>
      <p>• {id.disclaimer.notBmkg}</p>
    </div>
  );
}
