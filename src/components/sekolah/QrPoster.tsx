"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { StatusBadge } from "./StatusBadge";
import type { SchoolStatus } from "@/types/domain";

interface QrPosterProps { schoolSlug: string; schoolName: string; status: SchoolStatus }

export function QrPoster({ schoolSlug, schoolName, status }: QrPosterProps) {
  const [qrUrl, setQrUrl] = useState("");
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/s/${schoolSlug}` : `/s/${schoolSlug}`;

  useEffect(() => {
    QRCode.toDataURL(url, { width: 160, margin: 1 }).then(setQrUrl).catch(() => {});
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm print:border-slate-300">
      {qrUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qrUrl} alt={`QR kode status ${schoolName}`} width={160} height={160} className="rounded-xl" />
      )}
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{schoolName}</p>
        <StatusBadge status={status} size="sm" />
        <p className="text-xs text-slate-400 mt-1.5 break-all">{url}</p>
      </div>
    </div>
  );
}
