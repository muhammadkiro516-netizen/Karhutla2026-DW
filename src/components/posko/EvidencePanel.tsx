"use client";
import { useState } from "react";
import type { AnalysisResult } from "@/lib/evidence-browser";
import type { LatLon } from "@/types/domain";

const STATUS_COLOR: Record<string, string> = {
  TERVERIFIKASI: "text-green-700 dark:text-green-400",
  SEBAGIAN: "text-yellow-700 dark:text-yellow-400",
  TIDAK_SESUAI: "text-red-600 dark:text-red-400",
  BELUM_TERVERIFIKASI: "text-zinc-500 dark:text-zinc-400",
};

interface EvidencePanelProps {
  cityCenter: LatLon;
  onAnalyzed: (result: AnalysisResult) => void;
}

export function EvidencePanel({ cityCenter, onAnalyzed }: EvidencePanelProps) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const { analyzeFile } = await import("@/lib/evidence-browser");
      const r = await analyzeFile(file, cityCenter);
      setResult(r);
      onAnalyzed(r);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">
        Lampirkan foto asap (opsional)
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="text-sm"
        aria-label="Upload foto bukti"
      />
      {loading && <p className="text-xs text-zinc-400">Menganalisis EXIF…</p>}
      {result && (
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-3 text-xs flex flex-col gap-1">
          <p className={`font-semibold ${STATUS_COLOR[result.result.status]}`}>
            {result.result.status.replace(/_/g, " ")}
          </p>
          {result.result.reasons.map((r, i) => (
            <p key={i} className="text-zinc-500 dark:text-zinc-400">• {r}</p>
          ))}
          <p className="text-zinc-400 dark:text-zinc-500 mt-1">
            EXIF dapat dimanipulasi, bukan bukti hukum.
          </p>
        </div>
      )}
    </div>
  );
}
