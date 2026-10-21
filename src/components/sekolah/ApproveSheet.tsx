"use client";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { StatusBadge } from "./StatusBadge";
import { id } from "@/i18n/id";
import type { SchoolStatus } from "@/types/domain";
import type { DecisionPayload } from "@/lib/audit";

interface ApproveSheetProps {
  open: boolean;
  onClose: () => void;
  schoolSlug: string;
  schoolName: string;
  cityId: string;
  recommended: SchoolStatus;
  ispu: number | null;
  onApprove: (payload: DecisionPayload) => Promise<void>;
}

const STATUS_OPTIONS = [
  { code: "NORMAL", label: "Normal" },
  { code: "WASPADA", label: "Waspada" },
  { code: "HYBRID", label: "Hybrid" },
  { code: "DARING_DARURAT", label: "Daring Darurat" },
] as const;

export function ApproveSheet({
  open,
  onClose,
  schoolSlug,
  schoolName,
  cityId,
  recommended,
  ispu,
  onApprove,
}: ApproveSheetProps) {
  const [decided, setDecided] = useState(recommended.code);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onApprove({
      at: new Date().toISOString(),
      cityId,
      school: schoolSlug,
      ispu: ispu ?? 0,
      recommended: recommended.code,
      decided,
      approver: "Kepala Sekolah/Dinas (demo)",
      note: note || undefined,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={`Setujui Status — ${schoolName}`}>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Rekomendasi mesin</p>
          <StatusBadge status={recommended} size="sm" />
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-2">Status yang disetujui</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setDecided(opt.code)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  decided === opt.code
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent"
                    : "border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">
            Catatan (opsional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Alasan perubahan dari rekomendasi..."
            className="w-full border rounded-lg p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 resize-none"
            rows={2}
          />
        </div>
        <button
          onClick={handleApprove}
          disabled={loading}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg py-2 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Menyimpan…" : id.ui.approve}
        </button>
      </div>
    </Sheet>
  );
}
