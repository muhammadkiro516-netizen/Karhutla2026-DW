"use client";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { StatusBadge } from "./StatusBadge";
import { id } from "@/i18n/id";
import type { SchoolStatus } from "@/types/domain";
import type { DecisionPayload } from "@/lib/audit";

interface ApproveSheetProps {
  open: boolean; onClose: () => void;
  schoolSlug: string; schoolName: string; cityId: string;
  recommended: SchoolStatus; ispu: number | null;
  onApprove: (payload: DecisionPayload) => Promise<void>;
}

const STATUS_OPTIONS = [
  { code: "NORMAL", label: "Normal" },
  { code: "WASPADA", label: "Waspada" },
  { code: "HYBRID", label: "Hybrid" },
  { code: "DARING_DARURAT", label: "Daring Darurat" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  NORMAL: "bg-emerald-500",
  WASPADA: "bg-yellow-500",
  HYBRID: "bg-orange-500",
  DARING_DARURAT: "bg-red-600",
};

export function ApproveSheet({ open, onClose, schoolSlug, schoolName, cityId, recommended, ispu, onApprove }: ApproveSheetProps) {
  const [decided, setDecided] = useState(recommended.code);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onApprove({
      at: new Date().toISOString(), cityId, school: schoolSlug,
      ispu: ispu ?? 0, recommended: recommended.code, decided,
      approver: "Kepala Sekolah/Dinas (demo)", note: note || undefined,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={`Setujui Status — ${schoolName}`}>
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-medium">Rekomendasi mesin</p>
          <StatusBadge status={recommended} size="sm" />
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-3 uppercase tracking-wide font-medium">Status yang disetujui</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(opt => (
              <button key={opt.code} onClick={() => setDecided(opt.code)}
                className={`px-4 py-1.5 rounded-2xl text-sm font-semibold transition-all ${
                  decided === opt.code
                    ? `${STATUS_COLORS[opt.code] ?? "bg-slate-800"} text-white shadow-md`
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wide font-medium">
            Catatan (opsional)
          </label>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Alasan perubahan dari rekomendasi..."
            className="w-full border border-slate-200 dark:border-slate-600 rounded-2xl p-3 text-sm bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={2} />
        </div>
        <button onClick={handleApprove} disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 text-sm font-semibold disabled:opacity-50 transition-colors shadow-md shadow-blue-400/25">
          {loading ? "Menyimpan…" : id.ui.approve}
        </button>
      </div>
    </Sheet>
  );
}
