import { id } from "@/i18n/id";

export function EmergencyCard() {
  return (
    <div className="rounded-[--radius-card] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
      <p className="text-sm font-bold text-red-700 dark:text-red-300 mb-2">🚨 Kontak Darurat</p>
      <div className="flex flex-col gap-1">
        {Object.values(id.emergency).map(line => {
          const parts = line.split(": ");
          const name = parts[0];
          const num = parts[1];
          return (
            <div key={line} className="flex items-center justify-between text-sm">
              <span className="text-zinc-700 dark:text-zinc-200">{name}</span>
              <a
                href={`tel:${num?.replace(/[^0-9]/g, "")}`}
                className="font-mono font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                {num}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
