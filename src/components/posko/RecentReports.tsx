"use client";
import { useLocalStore } from "@/hooks/useLocalStore";

interface ReportEntry { reportId: string; description: string; at: string; status: string }

export function RecentReports() {
  const [reports] = useLocalStore<ReportEntry[]>("eduair.reports", []);
  if (!reports.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Laporan Terakhir</p>
      {reports.slice(0, 5).map(r => (
        <div key={r.reportId} className="text-xs bg-white dark:bg-slate-700 rounded-2xl px-3 py-2.5 border border-slate-100 dark:border-slate-600 shadow-sm">
          <div className="flex justify-between gap-2">
            <span className="font-mono font-semibold text-slate-600 dark:text-slate-200">{r.reportId}</span>
            <span className="text-slate-400">{new Date(r.at).toLocaleString("id-ID")}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 truncate">{r.description}</p>
        </div>
      ))}
    </div>
  );
}
