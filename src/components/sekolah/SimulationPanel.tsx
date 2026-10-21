"use client";
import { useState, useMemo } from "react";
import { deriveStatusTimeline, rulesFor } from "@/lib/school-status";
import { StatusBadge } from "./StatusBadge";
import { Card } from "@/components/ui/Card";

interface SimulationPanelProps {
  vulnerable?: boolean;
}

export function SimulationPanel({ vulnerable }: SimulationPanelProps) {
  const [ispu, setIspu] = useState(150);
  const [hours, setHours] = useState(4);

  const series = useMemo(() => {
    const baseline = Math.max(0, 24 - hours);
    return [
      ...Array<number>(baseline).fill(0),
      ...Array<number>(hours).fill(ispu),
    ];
  }, [ispu, hours]);

  const result = useMemo(() => {
    const tl = deriveStatusTimeline(series, rulesFor(vulnerable));
    return tl[tl.length - 1];
  }, [series, vulnerable]);

  const pulse = result && result.level >= 2;

  return (
    <Card>
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
        Simulasi Status (log terpisah)
      </p>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-zinc-600 dark:text-zinc-300 mb-1 block">
            ISPU:{" "}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {ispu}
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={500}
            value={ispu}
            onChange={(e) => setIspu(Number(e.target.value))}
            className="w-full"
            aria-label="Nilai ISPU simulasi"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-600 dark:text-zinc-300 mb-1 block">
            Durasi:{" "}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {hours} jam
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={24}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full"
            aria-label="Durasi jam simulasi"
          />
        </div>
        {result && (
          <div
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pulse ? "animate-pulse" : ""}`}
          >
            <StatusBadge status={result} vulnerable={vulnerable} size="md" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">
              {result.reason}
            </p>
          </div>
        )}
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Simulasi tidak memengaruhi status resmi. Data log simulasi disimpan
          terpisah.
        </p>
      </div>
    </Card>
  );
}
