import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Tentang PyroAlert Karhutla '26",
  description: "Cara kerja, keterbatasan, dan sumber data PyroAlert.",
};

export default function AboutPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col gap-6 pb-20">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tentang PyroAlert Karhutla '26</h1>

      <Card>
        <h2 className="text-base font-semibold mb-2">Masalah yang Kami Coba Selesaikan</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Setiap musim kemarau, asap karhutla menutup langit Sumatera dan Kalimantan. Orang tua
          bingung: apakah aman mengirim anak ke sekolah? Kepala sekolah butuh rekomendasi berbasis
          data, bukan perkiraan. PyroAlert Karhutla '26 mengubah data satelit dan kualitas udara menjadi
          keputusan yang jelas.
        </p>
      </Card>

      <Card>
        <h2 className="text-base font-semibold mb-3">Cara Kerja (4 Langkah)</h2>
        <svg viewBox="0 0 480 80" className="w-full mb-3" aria-label="Alur: Data → Hitung → Rekomendasi → Persetujuan manusia">
          {[
            { x: 10, label: "Data", sub: "Satelit & API" },
            { x: 130, label: "Hitung", sub: "ISPU + Angin" },
            { x: 250, label: "Rekomen-dasi", sub: "Mesin" },
            { x: 370, label: "Setujui", sub: "Manusia" },
          ].map((s, i) => (
            <g key={s.label}>
              <rect x={s.x} y={10} width={90} height={50} rx={8} fill="#3b82f6" opacity={0.1} />
              <text x={s.x + 45} y={32} textAnchor="middle" fontSize={11} fontWeight="600" fill="currentColor">{s.label}</text>
              <text x={s.x + 45} y={48} textAnchor="middle" fontSize={9} fill="#94a3b8">{s.sub}</text>
              {i < 3 && <text x={s.x + 100} y={37} textAnchor="middle" fontSize={14} fill="#94a3b8">→</text>}
            </g>
          ))}
        </svg>
        <ol className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
          <li>Data PM2.5 dari Open-Meteo CAMS + titik api dari NASA FIRMS VIIRS.</li>
          <li>Konversi ke ISPU (P.14/2020), simulasi sebaran angin, status sekolah dihitung otomatis.</li>
          <li>Mesin merekomendasikan status: Normal, Waspada, Hybrid, atau Daring Darurat.</li>
          <li>Kepala Sekolah/Dinas menyetujui status resmi — mesin hanya membantu, manusia yang memutuskan.</li>
        </ol>
      </Card>

      <Card>
        <h2 className="text-base font-semibold mb-2">Kebaruan</h2>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed list-disc list-inside">
          <li>Menggabungkan 3 sumber data (udara, satelit, cuaca) dalam satu tampilan keputusan.</li>
          <li>Simulasi sebaran asap berbasis angin per jam dari titik api nyata.</li>
          <li>Log keputusan hash-chain — tidak bisa diubah tanpa terdeteksi.</li>
          <li>QR poster sekolah — orang tua bisa cek status tanpa install apapun.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-base font-semibold mb-2">Keterbatasan (Penting)</h2>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed list-disc list-inside">
          <li>CAMS ≈ model resolusi 40 km, bukan pengukuran stasiun tanah.</li>
          <li>Titik panas (hotspot) ≠ kebakaran terkonfirmasi — bisa berupa lahan gambut yang membara.</li>
          <li>Model sebaran asap sangat sederhana — bukan prakiraan BMKG/BNPB.</li>
          <li>Metadata EXIF foto dapat dipalsukan — bukan bukti hukum.</li>
          <li>Bukan pengganti sistem resmi BMKG, BNPB, atau Dinas Kesehatan.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-base font-semibold mb-2">Sumber Data</h2>
        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
          <p>• <strong>Kualitas Udara:</strong> Open-Meteo (CAMS Reanalysis) — CC BY 4.0</p>
          <p>• <strong>Titik Api:</strong> NASA FIRMS VIIRS SNPP/NOAA20/NOAA21 — publik</p>
          <p>• <strong>Cuaca/Angin:</strong> Open-Meteo GFS/ICON — gratis</p>
          <p>• <strong>Fasilitas Kesehatan:</strong> OpenStreetMap (ODbL)</p>
          <p>• <strong>Ambang ISPU:</strong> Permen LHK P.14/MENLHK/SETJEN/KUM.1/7/2020</p>
        </div>
      </Card>

      <p className="text-xs text-slate-400 text-center">
        PyroAlert Karhutla &apos;26 adalah proyek riset terbuka. Kode sumber tersedia di GitHub.
      </p>
    </div>
  );
}
