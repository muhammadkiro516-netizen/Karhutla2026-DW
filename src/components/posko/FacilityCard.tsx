import { Phone, MapPin, Building2, Cross, Pill, Tent } from "lucide-react";
import { DemoChip } from "@/components/ui/DemoChip";
import type { Facility } from "@/types/api";

const TYPE_LABEL: Record<Facility["type"], string> = {
  RS: "Rumah Sakit", PUSKESMAS_KLINIK: "Puskesmas / Klinik", APOTEK: "Apotek", POSKO: "Posko",
};
const TYPE_ICON: Record<Facility["type"], React.ComponentType<{ size?: number; className?: string }>> = {
  RS: Cross, PUSKESMAS_KLINIK: Building2, APOTEK: Pill, POSKO: Tent,
};
const TYPE_COLOR: Record<Facility["type"], string> = {
  RS:               "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900",
  PUSKESMAS_KLINIK: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900",
  APOTEK:           "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900",
  POSKO:            "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900",
};

export function FacilityCard({ facility: f }: { facility: Facility }) {
  const mapsUrl = `https://www.google.com/maps?q=${f.lat},${f.lon}`;
  const Icon = TYPE_ICON[f.type];
  const colorClass = TYPE_COLOR[f.type];
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-all hover:-translate-y-px">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{TYPE_LABEL[f.type]}</span>
            {f.seeded && <DemoChip />}
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{f.name}</p>
          {f.address && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{f.address}</p>}
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl flex-shrink-0 whitespace-nowrap">
          {f.distanceKm} km
        </span>
      </div>
      <div className="flex gap-2">
        {f.phone && (
          <a
            href={`tel:${f.phone.replace(/[^0-9+]/g, "")}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl py-2.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 transition-colors"
          >
            <Phone size={12} />
            {f.phone}
          </a>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${f.phone ? "" : "flex-1 "}flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors px-4`}
        >
          <MapPin size={12} />
          Peta
        </a>
      </div>
      <p className="text-[10px] text-slate-300 dark:text-slate-600">
        {f.seeded ? "Data seed — belum terverifikasi lapangan" : "Sumber: OpenStreetMap (ODbL)"}
      </p>
    </div>
  );
}
