"use client";
import { useState, useMemo } from "react";
import { deriveStatusTimeline, rulesFor } from "@/lib/school-status";
import { StatusBadge } from "./StatusBadge";
import { Card } from "@/components/ui/Card";

export function SimulationPanel({ vulnerable }: { vulnerable?: boolean }) {
  const [ispu, setIspu] = useState(150);
  const [hours, setHours] = useState(4);

  const series = useMemo(() => [
    ...Array<number>(Math.max(0, 24 - hours)).fill(0),
    ...Array<number>(hours).fill(ispu),
  ], [ispu, hours]);

  const result = useMemo(() => {
    const tl = deriveStatusTimeline(series, rulesFor(vulnerable));
    return tl[tl.length - 1];
  }, [series, vulnerable]);

  const pulse = result && result.level >= 2;

  return (
    <Card>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Simulasi Status (log terpisah)</p>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-300 mb-2 flex justify-between">
            <span>ISPU</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{ispu}</span>
          </label>
          <input type="range" min={0} max={500} value={ispu}
            onChange={e => setIspu(Number(e.target.value))}
            className="w-full accent-blue-500" aria-label="Nilai ISPU simulasi" />
        </div>
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-300 mb-2 flex justify-between">
            <span>Durasi</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{hours} jam</span>
          </label>
          <input type="range" min={1} max={24} value={hours}
            onChange={e => setHours(Number(e.target.value))}
            className="w-full accent-blue-500" aria-label="Durasi jam simulasi" />
        </div>
        {result && (
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 transition-all ${pulse ? "animate-pulse" : ""}`}>
            <StatusBadge status={result} vulnerable={vulnerable} size="md" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{result.reason}</p>
          </div>
        )}
        <p className="text-xs text-slate-400">Simulasi tidak memengaruhi status resmi.</p>
      </div>
    </Card>
  );
}
