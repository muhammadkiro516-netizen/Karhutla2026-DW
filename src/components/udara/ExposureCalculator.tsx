"use client";
/**
 * ExposureCalculator — interactive tool.
 * User sets:
 *   - hours outside  (slider 0–12)
 *   - activity level (rest / walk / run)
 *   - mask type      (none / surgical / N95)
 * Returns:
 *   - µg PM2.5 inhaled (real formula: minute ventilation × concentration × hours × mask efficiency)
 *   - cigarette equivalent (Berkeley Earth, 1 cig = 22 µg/m³)
 *   - risk sentence
 *
 * Minute ventilation values (L/min) per activity:
 *   rest ≈ 8 L/min, walking ≈ 20 L/min, running ≈ 50 L/min
 *   Source: US EPA Exposure Factors Handbook 2011 (Table 6-1)
 * Mask efficiency (fraction of PM2.5 blocked):
 *   none = 0%, surgical = 30–50% (avg 40%), N95 = 95%
 *   Source: Rengasamy et al. 2009; CDC mask guidance.
 */
import { useState, useMemo } from "react";
import { Cigarette, Wind, Activity } from "lucide-react";

const ACTIVITIES = [
  { id: "rest",    label: "Istirahat",  ventLpm: 8,  subLabel: "duduk/tidur" },
  { id: "walk",    label: "Jalan",      ventLpm: 20, subLabel: "santai" },
  { id: "run",     label: "Olahraga",   ventLpm: 50, subLabel: "berlari" },
] as const;

const MASKS = [
  { id: "none",     label: "Tanpa masker", efficiency: 0,    color: "bg-red-100 border-red-200 text-red-700" },
  { id: "surgical", label: "Masker bedah", efficiency: 0.40, color: "bg-blue-100 border-blue-200 text-blue-700" },
  { id: "n95",      label: "N95 / KN95",  efficiency: 0.95, color: "bg-emerald-100 border-emerald-200 text-emerald-700" },
] as const;

// µg PM2.5 inhaled in one day of 8h smoking × 1 cigarette ≈ 22 µg/m³ × 8L/min × 480min × 1e-6 m³/L ≈ 0.084 mg
// Berkeley Earth uses a simpler exposure model. We'll use the direct volume approach.
// 1 cigarette ≡ 22 µg/m³ avg ambient PM2.5 for 24h (Berkeley Earth)
// So per-minute exposure at 22µg/m³ breathing 8 L/min = 22 × 8×10⁻³ µg/min = 0.176 µg/min
// 24h = 1440 min → 253 µg. That's ~1 cigarette. We use this ratio.
const CIG_DAILY_UG = 22 * 8e-3 * 60 * 24; // ≈ 253 µg (Berkeley Earth resting exposure reference)

function computeExposure(
  pm25: number,
  hoursOutside: number,
  ventLpm: number,
  maskEfficiency: number,
): { ugInhaled: number; cigEq: number } {
  // Volume breathed outside (litres) → convert to m³
  const volM3 = ventLpm * hoursOutside * 60 * 1e-3;
  // Effective concentration after mask filtration
  const effectivePm25 = pm25 * (1 - maskEfficiency);
  // µg inhaled = concentration (µg/m³) × volume (m³)
  const ugInhaled = effectivePm25 * volM3;
  // Cigarette equivalent: calibrated to Berkeley Earth reference
  const cigEq = ugInhaled / CIG_DAILY_UG;
  return { ugInhaled, cigEq };
}

function riskSentence(ugInhaled: number, pm25: number, maskId: string): string {
  if (ugInhaled < 5) return "Paparan sangat rendah. Tidak ada risiko kesehatan yang diperkirakan.";
  if (ugInhaled < 50) return "Paparan ringan. Kelompok sensitif (asma, anak kecil) sebaiknya tetap waspada.";
  if (ugInhaled < 200) return "Paparan sedang. Batasi waktu di luar. Pertimbangkan N95 untuk aktivitas lebih.";
  if (maskId === "none" && pm25 > 55) return "Paparan tinggi tanpa pelindung! Segera pakai masker N95/KN95.";
  if (ugInhaled < 600) return "Paparan cukup tinggi. Kurangi jam di luar atau tingkatkan proteksi masker.";
  return "Paparan sangat tinggi. Masuk ke dalam ruangan sekarang dan minimalkan aktivitas luar.";
}

interface Props { pm25: number | null }

export function ExposureCalculator({ pm25 }: Props) {
  const [hours, setHours] = useState(2);
  const [activityId, setActivityId] = useState<"rest" | "walk" | "run">("walk");
  const [maskId, setMaskId] = useState<"none" | "surgical" | "n95">("none");

  const activity = ACTIVITIES.find(a => a.id === activityId) ?? ACTIVITIES[1];
  const mask = MASKS.find(m => m.id === maskId) ?? MASKS[0];

  const result = useMemo(() => {
    if (pm25 == null) return null;
    return computeExposure(pm25, hours, activity.ventLpm, mask.efficiency);
  }, [pm25, hours, activity.ventLpm, mask.efficiency]);

  if (pm25 == null) return null;

  const riskMsg = result ? riskSentence(result.ugInhaled, pm25, maskId) : "";
  const cigColor = !result ? "text-slate-400"
    : result.cigEq < 0.2 ? "text-emerald-600"
    : result.cigEq < 1 ? "text-amber-600"
    : "text-red-600";

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-slate-400" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kalkulator Paparan</p>
      </div>
      <p className="text-[11px] text-slate-400 -mt-2 leading-relaxed">
        Hitung berapa partikel PM2.5 yang masuk ke paru-parumu hari ini
      </p>

      {/* Hours slider */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-slate-600">Jam di luar ruangan</span>
          <span className="text-sm font-black tabular-nums text-slate-800">{hours} jam</span>
        </div>
        <input
          type="range" min={0} max={12} step={0.5} value={hours}
          onChange={e => setHours(Number(e.target.value))}
          className="w-full h-2 rounded-full accent-blue-500 cursor-pointer"
          aria-label="Jam di luar"
        />
        <div className="flex justify-between text-[10px] text-slate-300 mt-0.5">
          <span>0 jam</span><span>12 jam</span>
        </div>
      </div>

      {/* Activity selector */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-2">Tingkat aktivitas</p>
        <div className="flex gap-2">
          {ACTIVITIES.map(a => (
            <button key={a.id} onClick={() => setActivityId(a.id)}
              className={`flex-1 py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${
                activityId === a.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}>
              <div>{a.label}</div>
              <div className={`text-[10px] font-normal mt-0.5 ${activityId === a.id ? "text-white/60" : "text-slate-400"}`}>
                {a.ventLpm} L/min
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mask selector */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-2">Masker yang dipakai</p>
        <div className="flex flex-col gap-1.5">
          {MASKS.map(m => (
            <button key={m.id} onClick={() => setMaskId(m.id)}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                maskId === m.id ? m.color + " ring-2 ring-offset-1 ring-current/20" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}>
              <span>{m.label}</span>
              <span className={`text-[10px] font-bold ${maskId === m.id ? "opacity-70" : "text-slate-400"}`}>
                blokir {(m.efficiency * 100).toFixed(0)}% PM2.5
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">PM2.5 masuk paru</p>
              <p className="text-2xl font-black tabular-nums text-slate-800">
                {result.ugInhaled < 1000
                  ? `${result.ugInhaled.toFixed(1)} µg`
                  : `${(result.ugInhaled / 1000).toFixed(2)} mg`}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {activity.ventLpm} L/min × {hours}j × {pm25.toFixed(0)} µg/m³
                {mask.efficiency > 0 ? ` × ${(1 - mask.efficiency) * 100}%` : ""}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Setara rokok</p>
              <p className={`text-2xl font-black tabular-nums ${cigColor}`}>
                {result.cigEq < 0.1
                  ? `< 0.1`
                  : result.cigEq.toFixed(result.cigEq < 10 ? 1 : 0)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Cigarette size={10} className="text-slate-300" />
                <p className="text-[10px] text-slate-400">batang rokok</p>
              </div>
            </div>
          </div>

          {/* Risk message */}
          <div className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed font-medium ${
            result.ugInhaled < 5 ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : result.ugInhaled < 200 ? "bg-amber-50 text-amber-700 border border-amber-100"
            : "bg-red-50 text-red-700 border border-red-100"
          }`}>
            {riskMsg}
          </div>

          {/* Breathing volume context */}
          <p className="text-[10px] text-slate-300 leading-relaxed text-center">
            <Wind size={9} className="inline mr-1" />
            Volume napas: {(activity.ventLpm * hours * 60 * 1e-3).toFixed(1)} m³ udara dalam {hours} jam
          </p>
        </div>
      )}

      <p className="text-[10px] text-slate-300 leading-relaxed">
        Formula: EPA Exposure Factors Handbook (ventilasi), Berkeley Earth (rokok). Estimasi — kondisi aktual bervariasi.
      </p>
    </div>
  );
}
