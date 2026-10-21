"use client";
import { Sheet } from "@/components/ui/Sheet";
import type { SchoolStatus } from "@/types/domain";

interface WhySheetProps {
  open: boolean; onClose: () => void;
  status: SchoolStatus; schoolName: string;
}

export function WhySheet({ open, onClose, status, schoolName }: WhySheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={`Kenapa ${status.label}?`}>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">{schoolName}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{status.reason}</p>
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Rekomendasi ini dihasilkan oleh mesin berdasarkan data ISPU. Status resmi hanya berlaku setelah disetujui oleh Kepala Sekolah/Dinas.
        </p>
      </div>
    </Sheet>
  );
}
