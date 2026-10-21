import { Card } from "@/components/ui/Card";
import { DemoChip } from "@/components/ui/DemoChip";
import type { Facility } from "@/types/api";

const TYPE_LABEL: Record<Facility["type"], string> = {
  RS: "Rumah Sakit", PUSKESMAS_KLINIK: "Puskesmas/Klinik", APOTEK: "Apotek", POSKO: "Posko",
};
const TYPE_ICON: Record<Facility["type"], string> = {
  RS: "🏥", PUSKESMAS_KLINIK: "🏨", APOTEK: "💊", POSKO: "⛺",
};

export function FacilityCard({ facility: f }: { facility: Facility }) {
  const mapsUrl = `https://www.google.com/maps?q=${f.lat},${f.lon}`;
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{TYPE_ICON[f.type]}</span>
            <span className="text-xs font-medium text-slate-400">{TYPE_LABEL[f.type]}</span>
            {f.seeded && <DemoChip />}
          </div>
          <p className="text-sm font-semibold truncate">{f.name}</p>
          {f.address && <p className="text-xs text-slate-400 mt-0.5">{f.address}</p>}
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-xl flex-shrink-0">{f.distanceKm} km</span>
      </div>
      <div className="flex gap-2">
        {f.phone && (
          <a href={`tel:${f.phone}`}
            className="flex-1 text-center text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-xl py-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            📞 Hubungi
          </a>
        )}
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl py-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          🗺 Peta
        </a>
      </div>
      <p className="text-[10px] text-slate-300 dark:text-slate-600">Data: OpenStreetMap contributors (ODbL)</p>
    </Card>
  );
}
