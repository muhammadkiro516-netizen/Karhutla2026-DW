import { Card } from "@/components/ui/Card";
import { SCHOOL_RULES } from "@/config/thresholds";

export function RuleCard({ vulnerable }: { vulnerable?: boolean }) {
  const offset = vulnerable ? SCHOOL_RULES.vulnerableOffset : 0;
  const rules = [
    { label: "Waspada", color: "text-yellow-600", threshold: SCHOOL_RULES.waspada.above - offset, hours: SCHOOL_RULES.waspada.hours },
    { label: "Hybrid",  color: "text-orange-600", threshold: SCHOOL_RULES.hybrid.above  - offset, hours: SCHOOL_RULES.hybrid.hours  },
    { label: "Daring Darurat", color: "text-red-600", threshold: SCHOOL_RULES.daring.above - offset, hours: SCHOOL_RULES.daring.hours },
  ];
  return (
    <Card>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
        Aturan Status{vulnerable ? " (Mode Rentan)" : ""}
      </p>
      <div className="flex flex-col gap-2.5">
        {rules.map(r => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className={`font-semibold ${r.color}`}>{r.label}</span>
            <span className="text-slate-400 text-xs">ISPU &gt; {r.threshold} selama {r.hours} jam</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm border-t border-slate-100 dark:border-slate-700 pt-2 mt-1">
          <span className="text-slate-400 font-medium">Turun level</span>
          <span className="text-slate-400 text-xs">{SCHOOL_RULES.hysteresisHours} jam di bawah ambang</span>
        </div>
      </div>
      {vulnerable && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2">
          ⚠ Ambang diturunkan {SCHOOL_RULES.vulnerableOffset} poin untuk PAUD/SLB.
        </p>
      )}
    </Card>
  );
}
