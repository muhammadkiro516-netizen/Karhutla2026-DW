import { Card } from "@/components/ui/Card";

const TIPS = [
  "Tutup jendela dan pintu rapat-rapat.",
  "Gunakan masker N95 atau KN95 bila harus keluar.",
  "Hidupkan purifier udara jika tersedia.",
  "Perbanyak minum air putih.",
  "Hindari aktivitas fisik berat di luar ruangan.",
  "Pantau kondisi anak, lansia, dan penderita asma.",
];

export function SelfHelpCard() {
  return (
    <Card>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">💡 Langkah Mandiri</p>
      <ul className="flex flex-col gap-2">
        {TIPS.map(tip => (
          <li key={tip} className="text-xs text-slate-600 dark:text-slate-300 flex gap-2 items-start">
            <span className="text-blue-400 font-bold mt-px">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
