"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Wind, School, Flame, Tent, ChevronRight, AlertTriangle, Satellite, TreePine } from "lucide-react";

const FireScene = dynamic(() => import("./FireScene").then(m => m.FireScene), { ssr: false });

const FEATURES = [
  {
    icon: Wind,
    color: "from-blue-500 to-sky-400",
    title: "Kualitas Udara Real-Time",
    desc: "ISPU per jam dari CAMS Copernicus. 8 kota Kalimantan & Sumatera. Prakiraan 2 hari ke depan.",
  },
  {
    icon: School,
    color: "from-emerald-500 to-teal-400",
    title: "Status Sekolah Otomatis",
    desc: "Engine berbasis ISPU hitung Normal/Waspada/Hybrid/Daring Darurat. Kepala Sekolah setujui & kirim via WhatsApp.",
  },
  {
    icon: Flame,
    color: "from-orange-500 to-red-500",
    title: "Titik Api Satelit NASA",
    desc: "VIIRS SNPP + NOAA20 + NOAA21 real-time. Klaster & simulasi sebaran asap menuju kota.",
  },
  {
    icon: Tent,
    color: "from-violet-500 to-purple-500",
    title: "Posko & Fasilitas",
    desc: "Rumah sakit, klinik, apotek terdekat via OpenStreetMap. Stok APD real-time. Laporan warga.",
  },
];

const STATS = [
  { icon: Satellite, value: "3", label: "Satelit NASA VIIRS" },
  { icon: Wind, value: "8", label: "Kota Dipantau" },
  { icon: TreePine, value: "LIVE", label: "Data Real-Time" },
  { icon: AlertTriangle, value: "0", label: "Crash Dijamin" },
];

export function LandingPage() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated fire canvas background */}
        <FireScene />

        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />

        {/* Nav bar */}
        <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? "bg-black/70 backdrop-blur-md" : ""}`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-bold tracking-tight">EduAir</span>
          </div>
          <Link href="/udara"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-orange-500/30">
            Buka App <ChevronRight size={16} />
          </Link>
        </header>

        {/* Hero content */}
        <div className={`relative z-20 flex flex-col items-center text-center px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Badge */}
          <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 backdrop-blur-sm text-orange-300 px-4 py-1.5 rounded-full text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Data satelit NASA VIIRS aktif
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-4 drop-shadow-2xl">
            <span className="text-white">Edu</span>
            <span className="text-orange-400">Air</span>
          </h1>

          <p className="text-xl md:text-2xl font-light text-white/90 mb-2 max-w-xl drop-shadow-lg">
            Sistem Peringatan Karhutla untuk Sekolah & Warga
          </p>

          <p className="text-sm md:text-base text-white/60 mb-10 max-w-lg">
            Gabungkan data satelit titik api, kualitas udara ISPU, dan prakiraan cuaca menjadi satu keputusan: apakah sekolah aman besok?
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/udara"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all">
              🚀 Pantau Sekarang
            </Link>
            <Link href="/titik-api"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:scale-105 transition-all">
              🛰 Lihat Peta Api
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-60 animate-bounce">
          <span className="text-xs text-white/60">Gulir ke bawah</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-orange-950/80 to-red-950/80 border-y border-orange-800/30 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="flex flex-col items-center gap-2 text-center">
              <s.icon size={22} className="text-orange-400" />
              <span className="text-3xl font-black text-white">{s.value}</span>
              <span className="text-xs text-orange-300/70 uppercase tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">Fitur Unggulan</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Satu Platform,<br />
            <span className="text-orange-400">Semua Keputusan</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Tidak ada lagi informasi terpencar-pencar. EduAir menggabungkan data satelit, udara, dan cuaca menjadi rekomendasi yang bisa langsung diambil tindakan.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map(f => (
            <div key={f.title}
              className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-600 p-6 flex gap-4 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                <f.icon size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">Cara Kerja</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Dari Satelit ke Keputusan</h2>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col gap-0">
          {[
            { step: "01", icon: "🛰", title: "Satelit NASA VIIRS mendeteksi titik panas", desc: "3 satelit (SNPP, NOAA-20, NOAA-21) memindai setiap 12 jam. Data masuk dalam 3 jam." },
            { step: "02", icon: "🌫", title: "CAMS Copernicus ukur PM2.5", desc: "Model atmosfer 40 km resolusi estimasi partikel halus. Diperbarui setiap jam." },
            { step: "03", icon: "⚙️", title: "Engine hitung status sekolah", desc: "Algoritma ISPU berdasarkan Permen LHK P.14/2020. Escalate Waspada→Hybrid→Daring secara otomatis." },
            { step: "04", icon: "✅", title: "Kepala Sekolah setujui & umumkan", desc: "Status resmi hanya berlaku setelah disetujui manusia. Kirim pengumuman via WhatsApp 1 klik." },
          ].map((s, i) => (
            <div key={s.step} className="flex gap-4 relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                  {s.icon}
                </div>
                {i < 3 && <div className="w-0.5 h-12 bg-orange-800/40 mt-1" />}
              </div>
              <div className="pb-8">
                <span className="text-xs text-orange-500 font-mono font-bold">{s.step}</span>
                <h3 className="text-base font-bold text-white mt-0.5 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DISCLAIMER ──────────────────────────────────────── */}
      <section className="py-10 px-6 max-w-3xl mx-auto">
        <div className="rounded-3xl bg-amber-950/40 border border-amber-800/40 p-6 text-sm text-amber-300/80 space-y-2">
          <p className="font-semibold text-amber-300">⚠ Jujur tentang keterbatasan</p>
          <p>• CAMS adalah model 40 km, bukan pengukuran stasiun — nilai bersifat indikatif.</p>
          <p>• Titik panas satelit ≠ kebakaran terkonfirmasi di lapangan.</p>
          <p>• Model sebaran asap sangat sederhana, bukan prakiraan BMKG/BNPB.</p>
          <p>• EduAir adalah alat bantu keputusan, <strong className="text-amber-300">bukan pengganti informasi resmi BMKG atau BNPB.</strong></p>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-slate-950 to-black">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Lindungi<br />
            <span className="text-orange-400">Anak Sekolah Hari Ini</span>
          </h2>
          <p className="text-slate-400 mb-10">Gratis, tanpa akun, langsung bisa pakai.</p>
          <Link href="/udara"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all">
            🚀 Buka EduAir Sekarang <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-600">
        <p className="mb-1">
          EduAir — Data: <a href="https://open-meteo.com" className="hover:text-slate-400 transition-colors">Open-Meteo (CAMS, CC BY 4.0)</a>{" · "}
          <a href="https://firms.modaps.eosdis.nasa.gov" className="hover:text-slate-400 transition-colors">NASA FIRMS</a>{" · "}
          <a href="https://openstreetmap.org" className="hover:text-slate-400 transition-colors">OpenStreetMap (ODbL)</a>
        </p>
        <p>Bukan pengganti informasi resmi BMKG / BNPB / Dinas Kesehatan.</p>
      </footer>
    </div>
  );
}
