"use client";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { EvidencePanel } from "./EvidencePanel";
import type { AnalysisResult } from "@/lib/evidence-browser";
import type { LatLon } from "@/types/domain";

interface ReportSheetProps {
  open: boolean;
  onClose: () => void;
  cityId: string;
  cityCenter: LatLon;
  onSubmit: (data: {
    description: string;
    evidenceHash: string;
    status: string;
    reportId: string;
  }) => Promise<void>;
}

export function ReportSheet({ open, onClose, cityCenter, onSubmit }: Omit<ReportSheetProps, "cityId"> & { cityId?: string }) {
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const { buildReportId } = await import("@/lib/evidence-browser");
      const id = buildReportId(
        evidence?.hash ?? Math.random().toString(16).slice(2),
        new Date(),
      );
      await onSubmit({
        description,
        evidenceHash: evidence?.hash ?? "",
        status: evidence?.result.status ?? "BELUM_TERVERIFIKASI",
        reportId: id,
      });
      setReportId(id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Laporkan Asap">
      {reportId ? (
        <div className="text-center py-4">
          <p className="text-green-600 dark:text-green-400 font-semibold mb-2">Laporan dikirim ✓</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            ID Laporan: <span className="font-mono font-bold">{reportId}</span>
          </p>
          <button onClick={onClose} className="mt-4 text-sm underline text-zinc-500">
            Tutup
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Deskripsi (wajib)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Lokasi, kondisi asap, waktu…"
              rows={3}
              className="w-full border rounded-lg p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 resize-none"
            />
          </div>
          <EvidencePanel cityCenter={cityCenter} onAnalyzed={setEvidence} />
          <button
            onClick={handleSubmit}
            disabled={loading || !description.trim()}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg py-2 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Mengirim…" : "Kirim Laporan"}
          </button>
        </div>
      )}
    </Sheet>
  );
}
