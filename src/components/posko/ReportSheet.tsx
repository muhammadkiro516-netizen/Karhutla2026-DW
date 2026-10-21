"use client";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { EvidencePanel } from "./EvidencePanel";
import type { AnalysisResult } from "@/lib/evidence-browser";
import type { LatLon } from "@/types/domain";

interface ReportSheetProps {
  open: boolean; onClose: () => void;
  cityId?: string; cityCenter: LatLon;
  onSubmit: (data: { description: string; evidenceHash: string; status: string; reportId: string }) => Promise<void>;
}

export function ReportSheet({ open, onClose, cityCenter, onSubmit }: ReportSheetProps) {
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const { buildReportId } = await import("@/lib/evidence-browser");
      const id = buildReportId(evidence?.hash ?? Math.random().toString(16).slice(2), new Date());
      await onSubmit({ description, evidenceHash: evidence?.hash ?? "", status: evidence?.result.status ?? "BELUM_TERVERIFIKASI", reportId: id });
      setReportId(id);
    } finally { setLoading(false); }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Laporkan Asap">
      {reportId ? (
        <div className="text-center py-6">
          <p className="text-3xl mb-3">✅</p>
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">Laporan dikirim!</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            ID: <span className="font-mono font-bold">{reportId}</span>
          </p>
          <button onClick={onClose} className="mt-4 text-sm text-blue-500 hover:underline">Tutup</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wide font-medium">Deskripsi (wajib)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Lokasi, kondisi asap, waktu…" rows={3}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-2xl p-3 text-sm bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
          </div>
          <EvidencePanel cityCenter={cityCenter} onAnalyzed={setEvidence} />
          <button onClick={handleSubmit} disabled={loading || !description.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 text-sm font-semibold disabled:opacity-50 transition-colors shadow-md shadow-blue-400/25">
            {loading ? "Mengirim…" : "Kirim Laporan"}
          </button>
        </div>
      )}
    </Sheet>
  );
}
