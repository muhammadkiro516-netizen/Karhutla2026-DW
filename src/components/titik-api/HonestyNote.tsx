import { id } from "@/i18n/id";

export function HonestyNote() {
  return (
    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 p-3 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
      <p className="font-semibold text-zinc-600 dark:text-zinc-300">Catatan keterbatasan</p>
      <p>• {id.disclaimer.hotspot}</p>
      <p>• {id.disclaimer.drift}</p>
      <p>• Klaster adalah perkiraan lokasi, bukan titik presisi.</p>
      <p>• {id.disclaimer.notBmkg}</p>
    </div>
  );
}
