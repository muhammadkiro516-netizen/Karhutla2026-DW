"use client";
import { useLocalStore } from "@/hooks/useLocalStore";

interface ReportEntry {
  reportId: string;
  description: string;
  at: string;
  status: string;
}

export function RecentReports() {
  const [reports] = useLocalStore<ReportEntry[]>("eduair.reports", []);
  if (reports.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        Laporan Terakhir
      </p>
      {reports.slice(0, 5).map(r => (
        <div key={r.reportId} className="text-xs bg-zinc-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
          <div className="flex justify-between gap-2">
            <span className="font-mono font-medium">{r.reportId}</span>
            <span className="text-zinc-400">{new Date(r.at).toLocaleString("id-ID")}</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{r.description}</p>
        </div>
      ))}
    </div>
  );
}
