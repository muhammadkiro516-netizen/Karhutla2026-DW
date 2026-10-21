import { id } from "@/i18n/id";

export function EmergencyCard() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/30 border border-red-200 dark:border-red-800/50 p-4 shadow-sm">
      <p className="text-sm font-bold text-red-700 dark:text-red-300 mb-3">🚨 Kontak Darurat</p>
      <div className="flex flex-col gap-2">
        {Object.values(id.emergency).map(line => {
          const parts = line.split(": ");
          const name = parts[0]; const num = parts[1];
          return (
            <div key={line} className="flex items-center justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-200">{name}</span>
              <a href={`tel:${num?.replace(/[^0-9]/g, "")}`}
                className="font-mono font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2.5 py-0.5 rounded-lg hover:bg-red-200 transition-colors">
                {num}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
