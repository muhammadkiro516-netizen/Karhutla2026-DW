"use client";
import { Heart, Baby, PersonStanding, Wind, Cigarette, ShieldAlert } from "lucide-react";
import type { AirCity, WeatherCity } from "@/types/api";

/**
 * WHO PM2.5 guidelines (2021):
 *  - Annual guideline: 5 µg/m³
 *  - 24-hour guideline: 15 µg/m³
 * KLHK ISPU breakpoints for PM2.5 (Permen LHK P.14/2020):
 *  - BAIK ≤15.5 µg/m³ → ISPU ≤50
 *  - SEDANG 15.6–55.4 µg/m³ → ISPU 51–100
 *  - TIDAK_SEHAT 55.5–150.4 µg/m³ → ISPU 101–200
 *  - SANGAT_TIDAK_SEHAT 150.5–250.4 µg/m³ → ISPU 201–300
 *  - BERBAHAYA >250.5 µg/m³ → ISPU 301–500
 *
 * Cigarette equivalent: 1 cigarette ≈ +22 µg/m³ PM2.5 exposure (Berkeley Earth study).
 * Source: https://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
 */
function cigaretteEquivalent(pm25: number): number {
  // Daily exposure formula: cigarettes/day = pm25_µg_m3 / 22
  return pm25 / 22;
}

interface RiskGroup {
  id: string;
  label: string;
  risk: "AMAN" | "HATI_HATI" | "WASPADA" | "BAHAYA";
  note: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

function getRiskGroups(pm25: number | null): RiskGroup[] {
  if (pm25 == null) return [];
  return [
    {
      id: "normal",
      label: "Orang Dewasa Sehat",
      Icon: PersonStanding,
      risk: pm25 <= 15.5 ? "AMAN" : pm25 <= 55.4 ? "HATI_HATI" : pm25 <= 150.4 ? "WASPADA" : "BAHAYA",
      note: pm25 <= 15.5 ? "Tidak ada dampak kesehatan yang diharapkan."
          : pm25 <= 55.4 ? "Batasi aktivitas fisik berat di luar jika terasa tidak nyaman."
          : pm25 <= 150.4 ? "Kurangi aktivitas luar ruang. Gunakan masker bedah minimal."
          : "Hindari semua aktivitas di luar. Gunakan N95/KN95.",
    },
    {
      id: "vulnerable",
      label: "Anak < 12 thn, Lansia, Ibu Hamil",
      Icon: Baby,
      risk: pm25 <= 5 ? "AMAN" : pm25 <= 15.5 ? "HATI_HATI" : pm25 <= 55.4 ? "WASPADA" : "BAHAYA",
      note: pm25 <= 5 ? "Aman sesuai panduan WHO."
          : pm25 <= 15.5 ? "Melewati ambang tahunan WHO. Kelompok rentan perlu hati-hati."
          : pm25 <= 55.4 ? "Batasi aktivitas luar. Pakai masker. Pantau gejala napas."
          : "Tetap di dalam. Jika sesak napas, segera ke Puskesmas.",
    },
    {
      id: "asthma",
      label: "Penderita Asma & PPOK",
      Icon: Heart,
      risk: pm25 <= 5 ? "AMAN" : pm25 <= 15.5 ? "HATI_HATI" : pm25 <= 35.4 ? "WASPADA" : "BAHAYA",
      note: pm25 <= 5 ? "Aman, tetap bawa inhaler."
          : pm25 <= 15.5 ? "Siapkan inhaler. Hindari olahraga berat di luar."
          : pm25 <= 35.4 ? "Gunakan inhaler pencegahan. Pakai masker N95 di luar."
          : "Tetap di dalam. Pastikan inhaler/obat tersedia. Pertimbangkan evakuasi jika paparan >8 jam.",
    },
  ];
}

const RISK_CONFIG = {
  AMAN:       { label: "Aman",       bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-400" },
  HATI_HATI:  { label: "Hati-hati",  bg: "bg-blue-50",    border: "border-blue-100",    text: "text-blue-700",    dot: "bg-blue-400" },
  WASPADA:    { label: "Waspada",    bg: "bg-amber-50",   border: "border-amber-100",   text: "text-amber-700",   dot: "bg-amber-400" },
  BAHAYA:     { label: "Berbahaya",  bg: "bg-red-50",     border: "border-red-100",     text: "text-red-700",     dot: "bg-red-500" },
};

interface HealthRiskCardProps {
  air: AirCity | undefined;
  weather: WeatherCity | undefined;
}

export function HealthRiskCard({ air, weather }: HealthRiskCardProps) {
  const pm25 = air?.pm25 ?? null;
  if (pm25 == null) return null;

  const groups = getRiskGroups(pm25);
  const cigEq = cigaretteEquivalent(pm25);
  const whoLimit = 15; // µg/m³ 24-hour WHO guideline
  const overWho = pm25 > whoLimit;

  // Mask recommendation based on pm25
  const maskRec =
    pm25 <= 15.5 ? null :
    pm25 <= 55.4 ? "Masker kain berlapis 3 (non-woven) sudah membantu." :
    pm25 <= 150.4 ? "Masker bedah atau masker kain berlapis. Lebih baik N95/KN95." :
    "Wajib masker N95 atau KN95. Masker bedah tidak cukup untuk kondisi ini.";

  // Indoor vs outdoor comparison
  const windKmh = weather?.windKmh ?? 0;
  const indoorRisk =
    windKmh < 3 ? "Udara hampir tidak bergerak — membuka jendela tidak membantu malam ini." :
    windKmh < 15 ? "Tutup jendela yang menghadap arah angin datang untuk mengurangi masuknya asap." :
    "Angin kencang — tutup semua ventilasi, asap bisa masuk cepat.";

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Risiko Kesehatan
        </p>
        <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-full">
          PM2.5 = {pm25.toFixed(1)} µg/m³
        </span>
      </div>

      {/* Per-group risk */}
      <div className="flex flex-col gap-2">
        {groups.map(g => {
          const cfg = RISK_CONFIG[g.risk];
          return (
            <div key={g.id} className={`flex items-start gap-3 rounded-2xl border ${cfg.border} ${cfg.bg} px-3 py-2.5`}>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 bg-white border ${cfg.border}`}>
                <g.Icon size={14} className={cfg.text} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-slate-700 truncate">{g.label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.text} bg-white border ${cfg.border} flex-shrink-0`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{g.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cigarette equivalent */}
      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2.5">
        <Cigarette size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-slate-700">
            Setara dengan {cigEq.toFixed(1)} rokok/hari
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
            Berdasarkan metode Berkeley Earth (1 rokok ≈ +22 µg/m³). Menghirup udara ini 24 jam sama seperti merokok sebanyak itu.
          </p>
        </div>
      </div>

      {/* WHO comparison */}
      <div className={`flex items-start gap-3 rounded-2xl px-3 py-2.5 ${overWho ? "bg-amber-50 border border-amber-100" : "bg-emerald-50 border border-emerald-100"}`}>
        <ShieldAlert size={15} className={overWho ? "text-amber-500 flex-shrink-0 mt-0.5" : "text-emerald-500 flex-shrink-0 mt-0.5"} />
        <div>
          <p className={`text-xs font-semibold ${overWho ? "text-amber-700" : "text-emerald-700"}`}>
            {overWho
              ? `${(pm25 / whoLimit).toFixed(1)}× di atas panduan 24-jam WHO (${whoLimit} µg/m³)`
              : `Di bawah panduan 24-jam WHO (${whoLimit} µg/m³)`}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            WHO Air Quality Guidelines 2021. Panduan resmi Indonesia (ISPU P.14/2020) menggunakan skala berbeda.
          </p>
        </div>
      </div>

      {/* Mask recommendation */}
      {maskRec && (
        <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 px-3 py-2.5">
          <Wind size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-700">Rekomendasi Masker</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{maskRec}</p>
          </div>
        </div>
      )}

      {/* Indoor tip */}
      <p className="text-[11px] text-slate-400 leading-relaxed px-1">
        <span className="font-semibold text-slate-500">Tips dalam ruangan: </span>
        {indoorRisk}
      </p>
    </div>
  );
}
