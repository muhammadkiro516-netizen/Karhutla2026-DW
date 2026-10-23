import type { Metadata } from "next";
import { Satellite, Wind, Flame, ShieldCheck, AlertTriangle, Database, BookOpen, Users } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang PyroAlert — Karhutla '26",
  description: "Cara kerja, sumber data, dan keterbatasan PyroAlert.",
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl p-6 ${className}`}>{children}</section>;
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: color }}>
      {children}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-24 flex flex-col gap-5">

      {/* ── Hero ── */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-orange-500/10" />
        <div className="absolute -right-2 -bottom-4 w-24 h-24 rounded-full bg-red-500/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <Flame size={18} className="text-white" />
            </div>
            <div>
              <p className="font-black text-lg leading-tight">Pyro<span className="text-orange-400">Alert</span></p>
              <p className="text-xs text-white/50">Karhutla &apos;26</p>
            </div>
          </div>
          <h1 className="text-2xl font-black mb-2 leading-tight">Sistem Peringatan Dini<br />Kebakaran Hutan Indonesia</h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Menyatukan data satelit NASA, model udara Copernicus, dan cuaca real-time
            menjadi satu keputusan yang bisa langsung diambil tindakan — oleh orang tua,
            kepala sekolah, dan petugas posko.
          </p>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Badge color="#f97316">Real-time</Badge>
            <Badge color="#3b82f6">66 Kota</Badge>
            <Badge color="#22c55e">Gratis</Badge>
            <Badge color="#8b5cf6">Open Data</Badge>
          </div>
        </div>
      </div>

      {/* ── Masalah ── */}
      <Section className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-red-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-red-500">Masalah yang Diselesaikan</p>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed mb-3">
          Setiap musim kemarau, asap karhutla menutup langit Sumatera dan Kalimantan.
          Orang tua, kepala sekolah, dan petugas posko menghadapi pertanyaan yang sama
          tanpa data yang cukup untuk menjawabnya:
        </p>
        <div className="flex flex-col gap-2">
          {[
            { q: "Apakah aman kirim anak ke sekolah hari ini?", who: "Orang tua" },
            { q: "Data mana yang saya pakai untuk meliburkan sekolah?", who: "Kepala Sekolah" },
            { q: "Dari arah mana asap datang dan seberapa cepat?", who: "Petugas Posko" },
          ].map(item => (
            <div key={item.who} className="bg-white rounded-2xl px-4 py-3 border border-red-100">
              <p className="text-sm text-slate-700 italic">&ldquo;{item.q}&rdquo;</p>
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide mt-1">{item.who}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Cara Kerja ── */}
      <Section className="bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-blue-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500">Cara Kerja</p>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { n:"01", Icon:Satellite, color:"bg-blue-600", title:"Satelit NASA pindai Indonesia tiap 12 jam",
              body:"3 satelit VIIRS mendeteksi panas permukaan bumi secara real-time. Data masuk ke server dalam 3 jam." },
            { n:"02", Icon:Wind, color:"bg-sky-500", title:"Copernicus CAMS hitung PM2.5 per jam",
              body:"Model atmosfer 40 km estimasi partikel halus. Dikonversi ke ISPU sesuai Permen LHK P.14/2020." },
            { n:"03", Icon:Flame, color:"bg-amber-500", title:"Engine hitung status sekolah + arah asap",
              body:"Waspada (>100, 1j), Hybrid (>150, 3j), Daring Darurat (>200, 2j). Simulasi asap dari angin real-time." },
            { n:"04", Icon:ShieldCheck, color:"bg-emerald-600", title:"Manusia setujui — baru resmi berlaku",
              body:"Mesin hanya rekomendasi. Log audit hash-chain tidak bisa diubah. Status dikirim via WhatsApp 1 klik." },
          ].map((s,i) => (
            <div key={i} className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className={`w-8 h-8 rounded-xl ${s.color} text-white flex items-center justify-center text-xs font-black flex-shrink-0`}>{s.n}</div>
              <div>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <s.Icon size={13} className="text-slate-400" /> {s.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Sumber Data ── */}
      <Section className="bg-slate-950 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-orange-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Sumber Data</p>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { name:"NASA FIRMS VIIRS", desc:"Titik api real-time dari 3 satelit (SNPP, NOAA-20, NOAA-21). Gratis, publik.",
              link:"https://firms.modaps.eosdis.nasa.gov", logo:"/logo-nasa.png", logoW:60 },
            { name:"Open-Meteo CAMS", desc:"PM2.5 per jam dari model atmosfer Copernicus. CC BY 4.0.",
              link:"https://open-meteo.com", logo:null, logoW:0 },
            { name:"BMKG", desc:"Referensi ambang ISPU resmi Indonesia (Permen LHK P.14/2020).",
              link:"https://bmkg.go.id", logo:"/logo-bmkg.webp", logoW:44 },
            { name:"OpenStreetMap", desc:"Data fasilitas kesehatan (rumah sakit, puskesmas). ODbL license.",
              link:"https://openstreetmap.org", logo:null, logoW:0 },
          ].map(src => (
            <a key={src.name} href={src.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 transition-colors">
              {src.logo ? (
                <Image src={src.logo} alt={src.name} width={src.logoW} height={24}
                  className="object-contain h-6 w-auto opacity-80 brightness-200 flex-shrink-0" />
              ) : (
                <div className="w-10 h-6 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-black text-white/60 uppercase">{src.name.slice(0,3)}</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{src.name}</p>
                <p className="text-xs text-white/50 truncate">{src.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* ── Keterbatasan ── */}
      <Section className="bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-amber-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Keterbatasan Penting</p>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { title:"CAMS bukan alat ukur langsung", body:"Model 40 km/piksel. Selisih bisa 20–40% dari stasiun ISPU resmi di lapangan." },
            { title:"Hotspot bukan kebakaran pasti", body:"Bisa aspal panas, pabrik, atau gambut membara di bawah tanah." },
            { title:"Simulasi asap sangat sederhana", body:"Pakai 1 titik angin, bukan model dispersi BMKG/BNPB. Hanya indikasi arah." },
            { title:"Bukan pengganti informasi resmi", body:"Selalu cek BMKG dan BNPB untuk keputusan darurat. PyroAlert hanyalah alat bantu." },
          ].map(item => (
            <div key={item.title} className="flex gap-3 items-start bg-white rounded-2xl px-4 py-3 border border-amber-100">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Footer credit ── */}
      <div className="text-center py-2">
        <p className="text-xs text-slate-400">
          PyroAlert Karhutla &apos;26 — dibuat oleh{" "}
          <a href="https://instagram.com/avlfarizii" target="_blank" rel="noopener noreferrer"
            className="text-slate-600 font-semibold hover:text-orange-500 transition-colors">
            Muhammad Salman Al Farisi
          </a>
          {" · "}
          <a href="https://instagram.com/avlfarizii" target="_blank" rel="noopener noreferrer"
            className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
            @avlfarizii
          </a>
        </p>
      </div>
    </div>
  );
}
