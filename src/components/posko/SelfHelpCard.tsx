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
      <p className="text-sm font-semibold mb-2">💡 Langkah Mandiri</p>
      <ul className="flex flex-col gap-1">
        {TIPS.map(tip => (
          <li key={tip} className="text-xs text-zinc-600 dark:text-zinc-300 flex gap-2">
            <span className="text-zinc-400">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
