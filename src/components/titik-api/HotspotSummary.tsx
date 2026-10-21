import { DemoChip } from "@/components/ui/DemoChip";
import { SourceTag } from "@/components/ui/SourceTag";
import type { HotspotPayload } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

interface HotspotSummaryProps {
  payload: HotspotPayload | undefined;
  envelope: ApiEnvelope<HotspotPayload> | undefined;
}

export function HotspotSummary({ payload, envelope }: HotspotSummaryProps) {
  const total = payload?.clusters.length ?? 0;
  const highConf = payload?.clusters.filter(c => c.confidence === "TINGGI").length ?? 0;
  const medConf = payload?.clusters.filter(c => c.confidence === "SEDANG").length ?? 0;
  const fetchedAt = envelope?.fetchedAt;
  const timeStr = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/20 border border-orange-200 dark:border-orange-800/40 p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">🔥</span>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-slate-700 dark:text-slate-200">{total}</span>
            <span className="text-sm text-slate-500">klaster</span>
          </div>
          <p className="text-xs text-slate-500">{highConf} tinggi • {medConf} sedang</p>
        </div>
        {envelope?.demo && <div className="ml-auto"><DemoChip /></div>}
      </div>
      {envelope?.demo && (
        <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 mb-2">
          Contoh, bukan live — aktifkan FIRMS_MAP_KEY untuk data satelit nyata.
        </p>
      )}
      <SourceTag source={envelope?.source ?? "FIRMS VIIRS NRT"} time={timeStr} tz="UTC" />
    </div>
  );
}
