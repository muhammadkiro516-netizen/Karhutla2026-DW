import { Card } from "@/components/ui/Card";
import { SCHOOL_RULES } from "@/config/thresholds";

export function RuleCard({ vulnerable }: { vulnerable?: boolean }) {
  const offset = vulnerable ? SCHOOL_RULES.vulnerableOffset : 0;
  const rules = [
    {
      label: "Waspada",
      threshold: SCHOOL_RULES.waspada.above - offset,
      hours: SCHOOL_RULES.waspada.hours,
    },
    {
      label: "Hybrid",
      threshold: SCHOOL_RULES.hybrid.above - offset,
      hours: SCHOOL_RULES.hybrid.hours,
    },
    {
      label: "Daring Darurat",
      threshold: SCHOOL_RULES.daring.above - offset,
      hours: SCHOOL_RULES.daring.hours,
    },
  ];
  return (
    <Card>
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
        Aturan Status{vulnerable ? " (Mode Rentan)" : ""}
      </p>
      <div className="flex flex-col gap-2">
        {rules.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="font-medium">{r.label}</span>
            <span className="text-zinc-500 dark:text-zinc-400">
              ISPU &gt; {r.threshold} selama {r.hours} jam
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-400">Turun level</span>
          <span className="text-zinc-500 dark:text-zinc-400">
            Bertahan {SCHOOL_RULES.hysteresisHours} jam di bawah ambang
          </span>
        </div>
      </div>
      {vulnerable && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
          ⚠ Ambang diturunkan {SCHOOL_RULES.vulnerableOffset} poin untuk PAUD/SLB.
        </p>
      )}
    </Card>
  );
}
