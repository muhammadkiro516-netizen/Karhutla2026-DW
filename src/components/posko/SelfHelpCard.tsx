import { Card } from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

const TIPS = [
  { tip: "Tutup semua jendela dan pintu rapat-rapat.", level: "urgent" },
  { tip: "Gunakan masker N95 atau KN95 bila harus keluar rumah.", level: "urgent" },
  { tip: "Hidupkan air purifier atau AC filter jika tersedia.", level: "helpful" },
  { tip: "Perbanyak minum air putih, minimal 2 liter per hari.", level: "helpful" },
  { tip: "Hindari aktivitas fisik berat di luar ruangan.", level: "helpful" },
  { tip: "Pantau kondisi anak-anak, lansia, dan penderita asma secara berkala.", level: "helpful" },
  { tip: "Jika sesak napas atau mata perih, segera hubungi dokter atau Puskesmas.", level: "medical" },
];

export function SelfHelpCard() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <ShieldCheck size={14} className="text-blue-600" />
        </div>
        <p className="text-sm font-bold text-slate-700">Langkah Mandiri</p>
      </div>
      <ul className="flex flex-col gap-2">
        {TIPS.map(({ tip, level }) => (
          <li key={tip} className="flex gap-2.5 items-start text-xs text-slate-600">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
              level === "urgent" ? "bg-red-400" : level === "medical" ? "bg-amber-400" : "bg-blue-300"
            }`} />
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
        Rekomendasi umum saat kualitas udara memburuk. Selalu ikuti arahan resmi dari Dinas Kesehatan.
      </p>
    </Card>
  );
}
