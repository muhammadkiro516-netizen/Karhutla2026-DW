"use client";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "./StatusBadge";
import type { SchoolStatus } from "@/types/domain";

interface AnnouncementCardProps {
  schoolName: string;
  cityName: string;
  status: SchoolStatus;
  date: string;
  ispu: number | null;
}

function buildText(p: AnnouncementCardProps): string {
  return [
    "PENGUMUMAN STATUS SEKOLAH",
    "",
    p.schoolName,
    p.cityName,
    "",
    `Status: ${p.status.label.toUpperCase()}`,
    `Tanggal: ${p.date}`,
    p.ispu != null ? `ISPU: ${p.ispu}` : "",
    p.status.reason,
    "",
    "Sumber: EduAir (eduair.vercel.app)",
    "Bukan pengganti BMKG/BNPB.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function AnnouncementCard(props: AnnouncementCardProps) {
  const text = buildText(props);

  const copyText = () => {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      /* silent */
    }
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener",
    );
  };

  return (
    <Card className="announcement-card mt-2">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-semibold">
            Pengumuman Resmi
          </p>
          <p className="font-semibold mt-0.5">{props.schoolName}</p>
          <p className="text-sm text-zinc-500">
            {props.cityName} • {props.date}
          </p>
        </div>
        <StatusBadge status={props.status} size="lg" />
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
        {props.status.reason}
      </p>
      {props.ispu != null && (
        <p className="text-xs text-zinc-500 mb-3">
          ISPU saat keputusan: {props.ispu}
        </p>
      )}
      <p className="hidden print:block text-xs text-zinc-400 mt-2">
        Sumber: EduAir — Bukan pengganti BMKG/BNPB.
      </p>
      <div className="flex gap-2 print:hidden">
        <button
          onClick={copyText}
          className="flex-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          Salin
        </button>
        <button
          onClick={shareWhatsApp}
          className="flex-1 text-sm bg-green-600 text-white rounded-lg py-1.5 hover:bg-green-700"
        >
          WhatsApp
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          Cetak
        </button>
      </div>
    </Card>
  );
}
