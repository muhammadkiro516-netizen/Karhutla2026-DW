"use client";
import { Sheet } from "@/components/ui/Sheet";
import type { SchoolStatus } from "@/types/domain";

interface WhySheetProps {
  open: boolean;
  onClose: () => void;
  status: SchoolStatus;
  schoolName: string;
}

export function WhySheet({ open, onClose, status, schoolName }: WhySheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={`Kenapa ${status.label}?`}>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-2 font-medium">
        {schoolName}
      </p>
      <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">
        {status.reason}
      </p>
      <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Rekomendasi ini dihasilkan oleh mesin berdasarkan data ISPU. Status
          resmi hanya berlaku setelah disetujui oleh Kepala Sekolah/Dinas.
        </p>
      </div>
    </Sheet>
  );
}
