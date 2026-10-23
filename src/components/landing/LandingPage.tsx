"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight, Satellite, Wind, School, Flame, ShieldCheck,
  ArrowDown, MapPin, Clock, Users, CheckCircle2
} from "lucide-react";

const FireScene = dynamic(() => import("./FireScene").then(m => m.FireScene), { ssr: false });

/* ── scroll-reveal hook ─────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, on };
}

function Reveal({
  children, delay = 0, from = "bottom", className = ""
}: {
  children: React.ReactNode; delay?: number;
  from?: "bottom" | "left" | "right" | "top"; className?: string;
}) {
  const { ref, on } = useReveal();
  const base = from === "left" ? "translate-x-[-40px]"
    : from === "right" ? "translate-x-[40px]"
    : from === "top" ? "translate-y-[-32px]"
    : "translate-y-8";
  return (
    <div ref={ref}
      className={`transition-all duration-700 ease-out ${on ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${base}`} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── animated counter ───────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, on } = useReveal(0.3);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return;
    let c = 0; const step = to / 50;
    const id = setInterval(() => { c = Math.min(c + step, to); setV(Math.round(c)); if (c >= to) clearInterval(id); }, 25);
    return () => clearInterval(id);
  }, [on, to]);
  return <span ref={ref}>{v.toLocaleString("id-ID")}{suffix}</span>;
}

export function LandingPage() {
  const [heroOn, setHeroOn] = useState(false);
  useEffect(() => { setTimeout(() => setHeroOn(true), 60); }, []);

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">

      {/* ══ STICKY NAV (pill) ═══════════════════════════════════ */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-between items-center px-5 pointer-events-none">
        {/* Pill brand + CTA */}
        <div className="pointer-events-auto flex items-center gap-3 bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-white/60">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Flame size={13} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-slate-900 text-sm">Pyro<span className="text-orange-500">Alert</span></span>
            <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Karhutla &apos;26</span>
          </div>
        </div>

        <Link href="/udara" className="pointer-events-auto flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-lg">
          Buka App <ChevronRight size={14} />
        </Link>
      </div>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden pt-[60px]">
        <FireScene />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/80 z-10" />
        <div className={`relative z-20 text-center px-5 max-w-3xl mx-auto transition-all duration-800 ${heroOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Satelit NASA aktif — data diperbarui setiap 15 menit
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-3 drop-shadow-2xl">
            Pyro<span className="text-orange-400">Alert</span>
            <br />
            <span className="text-3xl md:text-4xl font-light text-white/60">Karhutla &apos;26</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 mb-3 leading-relaxed">
            Sistem peringatan kebakaran hutan real-time.<br className="hidden md:block" />
            Satelit NASA · Udara Copernicus · Referensi BMKG
          </p>
          <p className="text-sm text-white/50 mb-10 max-w-xl mx-auto">
            Untuk orang tua, kepala sekolah, petugas posko, dan warga terdampak asap di Kalimantan &amp; Sumatera.
          </p>
          {/* Powered by row in hero — clean, tidak maksa */}
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            <span className="text-white/30 text-xs uppercase tracking-widest font-bold">Data by</span>
            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/20">
                <Image src="/logo-nasa.png" alt="NASA" width={52} height={20} className="object-contain h-5 w-auto brightness-200 opacity-90" />
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/20">
                <Image src="/logo-bmkg.webp" alt="BMKG" width={44} height={20} className="object-contain h-5 w-auto brightness-200 opacity-90" />
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/20">
                <span className="text-white/80 text-xs font-bold">Copernicus</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/udara"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all">
              Pantau Sekarang <ChevronRight size={18} />
            </Link>
            <Link href="/titik-api"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105 backdrop-blur-sm">
              <Satellite size={18} /> Peta Satelit
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/30 animate-bounce">
          <ArrowDown size={22} />
        </div>
      </section>

      {/* ══ POWERED BY STRIP ════════════════════════════════════ */}
      <section className="py-10 px-5 bg-slate-50 border-y border-slate-100">
        <Reveal>
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Didukung data dari</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {/* NASA */}
            <a href="https://firms.modaps.eosdis.nasa.gov" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group hover:scale-105 transition-transform">
              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                <Image src="/logo-nasa.png" alt="NASA" width={80} height={32} className="object-contain h-8 w-auto" />
              </div>
              <span className="text-xs text-slate-400 font-medium">FIRMS VIIRS · 3 satelit</span>
            </a>
            {/* BMKG */}
            <a href="https://bmkg.go.id" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group hover:scale-105 transition-transform">
              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                <Image src="/logo-bmkg.webp" alt="BMKG" width={72} height={32} className="object-contain h-8 w-auto" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Referensi ISPU resmi</span>
            </a>
            {/* Copernicus */}
            <a href="https://atmosphere.copernicus.eu" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group hover:scale-105 transition-transform">
              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#003247] flex items-center justify-center">
                  <span className="text-white text-[9px] font-black">EU</span>
                </div>
                <span className="font-black text-[#003247] text-base">Copernicus</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">CAMS PM2.5 udara</span>
            </a>
            {/* Open-Meteo */}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group hover:scale-105 transition-transform">
              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                <span className="font-black text-slate-700 text-base">Open‑Meteo</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Cuaca &amp; angin</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* ══ STATS ═══════════════════════════════════════════════ */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <Reveal><p className="text-center text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Fakta Karhutla 2023</p></Reveal>
          <Reveal delay={60}><h2 className="text-center text-3xl md:text-4xl font-black text-slate-900 mb-12">Satu musim kemarau.<br />Ribuan jam udara berbahaya.</h2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { n: 253, s: " jam",     label: "Daring Darurat di Palangka Raya (Sep–Okt 2023)", c: "text-red-500" },
              { n: 40,  s: " klaster", label: "Titik api aktif terdeteksi rata-rata per hari", c: "text-orange-500" },
              { n: 128, s: " sekolah", label: "Sekolah dipantau di 8 kota rawan karhutla", c: "text-blue-600" },
              { n: 66,  s: " kota",    label: "Kota di seluruh Indonesia dari Sabang sampai Merauke", c: "text-emerald-600" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="text-center p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all">
                  <p className={`text-4xl font-black mb-2 ${s.c}`}><Counter to={s.n} suffix={s.s} /></p>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MASALAH ════════════════════════════════════════════ */}
      <section className="py-20 px-5 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          <Reveal from="left"><p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Masalah Nyata</p></Reveal>
          <Reveal delay={60}><h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight">Setiap September, pertanyaan yang<br />sama selalu muncul:</h2></Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { Icon: Users, q: '"Apakah aman kirim anak ke sekolah hari ini?"', who: "Orang tua & wali murid", color: "border-orange-200 bg-white" },
              { Icon: School, q: '"Data mana yang saya pakai untuk memutuskan meliburkan sekolah?"', who: "Kepala Sekolah & Dinas", color: "border-blue-200 bg-white" },
              { Icon: Wind, q: '"Dari arah mana asap datang dan seberapa cepat?"', who: "Petugas posko & relawan", color: "border-red-200 bg-white" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100} from={i === 0 ? "left" : i === 2 ? "right" : "bottom"}>
                <div className={`rounded-3xl border-2 ${item.color} p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                  <item.Icon size={22} className="text-slate-300 mb-3" />
                  <p className="text-base font-bold text-slate-800 mb-3 italic leading-snug">{item.q}</p>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.who}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={350}>
            <p className="text-center text-slate-500 text-base mt-10 max-w-2xl mx-auto leading-relaxed">
              PyroAlert menyatukan data NASA, Copernicus, dan BMKG dalam satu tampilan yang bisa langsung diambil tindakan.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ ALUR 4 LANGKAH ══════════════════════════════════════ */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal><p className="text-center text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Cara Kerja</p></Reveal>
          <Reveal delay={60}><h2 className="text-center text-3xl md:text-4xl font-black text-slate-900 mb-12">Dari satelit di angkasa<br />ke keputusan di tanganmu</h2></Reveal>
          <div className="flex flex-col gap-0">
            {[
              { n: "01", Icon: Satellite, color: "border-blue-200 bg-blue-50", badge: "bg-blue-600",
                title: "Satelit NASA pindai Indonesia setiap 12 jam",
                body: "3 satelit VIIRS (SNPP, NOAA-20, NOAA-21) deteksi panas permukaan bumi. Data masuk ke server dalam 3 jam. Bukan perkiraan — ini titik panas yang terdeteksi langsung dari orbit.",
                logo: <Image src="/logo-nasa.png" alt="NASA" width={40} height={16} className="object-contain h-4 w-auto opacity-80" /> },
              { n: "02", Icon: Wind, color: "border-sky-200 bg-sky-50", badge: "bg-sky-600",
                title: "Copernicus CAMS hitung PM2.5 per jam",
                body: "Model atmosfer 40 km dari Eropa estimasi partikel halus di udara. Dikonversi ke ISPU sesuai Permen LHK P.14/2020. Diperbarui setiap jam.",
                logo: <span className="text-xs font-black text-sky-600 bg-sky-100 px-2 py-0.5 rounded">Copernicus</span> },
              { n: "03", Icon: Flame, color: "border-amber-200 bg-amber-50", badge: "bg-amber-600",
                title: "Engine otomatis hitung status sekolah & arah asap",
                body: "Waspada (ISPU >100 selama 1 jam), Hybrid (>150, 3 jam), Daring Darurat (>200, 2 jam). Plus simulasi asap berdasarkan arah angin saat ini.",
                logo: <Image src="/logo-bmkg.webp" alt="BMKG" width={36} height={16} className="object-contain h-4 w-auto opacity-80" /> },
              { n: "04", Icon: ShieldCheck, color: "border-emerald-200 bg-emerald-50", badge: "bg-emerald-600",
                title: "Kepala Sekolah setujui — baru resmi",
                body: "Mesin hanya rekomendasi. Status resmi berlaku setelah manusia setujui. Log audit hash-chain tidak bisa diubah. Kirim via WhatsApp 1 klik.",
                logo: null },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 80} from={i % 2 === 0 ? "left" : "right"}>
                <div className={`relative flex gap-4 p-5 rounded-3xl border-2 ${s.color} hover:shadow-md transition-all duration-300 ${i < 3 ? "mb-3" : ""}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl ${s.badge} text-white flex items-center justify-center text-sm font-black shadow-sm`}>{s.n}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <s.Icon size={14} className="text-slate-500" />
                      <p className="font-bold text-slate-800 text-sm">{s.title}</p>
                      {s.logo && <span className="ml-auto">{s.logo}</span>}
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{s.body}</p>
                  </div>
                </div>
                {i < 3 && (
                  <div className="flex justify-center my-1"><div className="w-px h-6 bg-slate-200" /></div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4 FITUR ═════════════════════════════════════════════ */}
      <section className="py-20 px-5 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <Reveal><p className="text-center text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">4 Tab Utama</p></Reveal>
          <Reveal delay={60}><h2 className="text-center text-3xl md:text-4xl font-black text-white mb-12">Satu app, semua yang kamu butuhkan</h2></Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { Icon: Wind,   grad: "from-blue-600 to-sky-500",     sh: "shadow-blue-500/20",   label: "Tab Udara",     desc: "ISPU per jam + grafik 48 jam + tren harian. Pantau kualitas udara 66 kota di seluruh Indonesia.",    badge: "CAMS" },
              { Icon: School, grad: "from-emerald-500 to-teal-500", sh: "shadow-emerald-500/20",label: "Tab Sekolah",   desc: "128 sekolah, rekomendasi otomatis, persetujuan Kepala Sekolah, log audit, QR poster, kirim WhatsApp.", badge: "128 sekolah" },
              { Icon: Flame,  grad: "from-orange-500 to-red-500",   sh: "shadow-orange-500/20", label: "Tab Titik Api", desc: "Peta titik api NASA real-time. Klaster, ranking ancaman, simulasi asap berdasarkan arah angin.",      badge: "NASA FIRMS" },
              { Icon: MapPin, grad: "from-violet-500 to-purple-500",sh: "shadow-violet-500/20", label: "Tab Posko",     desc: "Fasilitas kesehatan terdekat dari 66 kota. Stok APD real-time. Laporan warga + verifikasi foto EXIF.",        badge: "OSM" },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 80} from={i % 2 === 0 ? "left" : "right"}>
                <div className={`rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-600 p-6 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-2xl ${f.sh}`}>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center mb-4 shadow-lg`}>
                    <f.Icon size={22} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-base font-black text-white">{f.label}</p>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full uppercase">{f.badge}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BACKTEST ════════════════════════════════════════════ */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal from="left"><p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Hasil Evaluasi Nyata</p></Reveal>
          <Reveal delay={60}><h2 className="text-center text-3xl md:text-4xl font-black text-slate-900 mb-3">Engine diuji dengan data historis 2023</h2></Reveal>
          <Reveal delay={120}><p className="text-center text-slate-400 mb-10 max-w-xl mx-auto">1.464 jam data PM2.5 historis September–Oktober 2023 per kota. Konsisten dengan laporan lapangan.</p></Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { city: "Palangka Raya", prov: "Kalimantan Tengah", daring: 253, waspada: 355, normal: 770, note: "Kebakaran gambut masif Kalteng 2023" },
              { city: "Jambi",         prov: "Provinsi Jambi",    daring: 0,   waspada: 12,  normal: 1452, note: "Musim kemarau lebih ringan" },
              { city: "Pekanbaru",     prov: "Riau",              daring: 0,   waspada: 61,  normal: 1403, note: "Asap kiriman dari Kalteng" },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="rounded-3xl border border-slate-200 p-5 hover:shadow-md transition-all">
                  <p className="text-base font-black text-slate-800">{c.city}</p>
                  <p className="text-xs text-slate-400 mb-4">{c.prov}</p>
                  {[
                    { label: "Daring Darurat", val: c.daring,  total: 1464, color: "bg-red-500",   text: "text-red-500"   },
                    { label: "Waspada/Hybrid", val: c.waspada, total: 1464, color: "bg-amber-400", text: "text-amber-500" },
                    { label: "Normal",         val: c.normal,  total: 1464, color: "bg-emerald-400",text: "text-emerald-600"},
                  ].map(r => (
                    <div key={r.label} className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`font-semibold ${r.text}`}>{r.label}</span>
                        <span className="font-bold tabular-nums text-slate-600">{r.val} jam</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full ${r.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${(r.val / r.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-slate-400 mt-3 italic">{c.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JUJUR KETERBATASAN ══════════════════════════════════ */}
      <section className="py-20 px-5 bg-amber-50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto">
          <Reveal><p className="text-center text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Jujur Tentang Batasan</p></Reveal>
          <Reveal delay={60}><h2 className="text-center text-2xl md:text-3xl font-black text-slate-900 mb-8">Yang perlu kamu tahu sebelum pakai</h2></Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "CAMS ≠ alat ukur langsung", body: "Model atmosfer 40 km per piksel. Nilainya estimasi, bukan stasiun ISPU resmi. Selisih bisa 20–40% dari kondisi aktual." },
              { title: "Titik panas ≠ kebakaran terkonfirmasi", body: "Satelit deteksi panas permukaan. Bisa berupa aspal panas, pabrik, atau gambut membara di bawah tanah." },
              { title: "Simulasi asap sangat sederhana", body: "Hanya pakai arah angin satu titik, bukan model dispersi seperti BMKG/BNPB. Anggap sebagai indikasi arah." },
              { title: "Bukan pengganti informasi resmi", body: "Selalu cek BMKG dan BNPB untuk keputusan darurat. PyroAlert adalah alat bantu, bukan autoritas resmi." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="bg-white rounded-2xl border border-amber-200 p-5 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={15} className="text-amber-400 flex-shrink-0" />
                    <p className="font-bold text-slate-800">{item.title}</p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed pl-5">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════ */}
      <section className="py-24 px-5 bg-slate-950 text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Image src="/logo-nasa.png" alt="NASA" width={52} height={21} className="object-contain h-[21px] w-auto opacity-50 brightness-200" />
            <span className="text-slate-700">·</span>
            <Image src="/logo-bmkg.webp" alt="BMKG" width={44} height={21} className="object-contain h-[21px] w-auto opacity-50 brightness-200" />
            <span className="text-slate-700">·</span>
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Copernicus CAMS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Gratis. Real-time.<br /><span className="text-orange-400">Mulai sekarang.</span>
          </h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto">Tidak perlu daftar akun. Tidak perlu install apapun. Buka dan langsung pantau.</p>
          <Link href="/udara"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all">
            Pantau Kondisi Udara Sekarang <ChevronRight size={22} />
          </Link>
          <p className="text-slate-600 text-xs mt-6 flex items-center justify-center gap-2">
            <Clock size={12} /> Data diperbarui setiap 10–15 menit
          </p>
        </Reveal>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-5 text-center text-xs text-slate-600">
        <div className="flex items-center justify-center gap-4 mb-3">
          <Image src="/logo-nasa.png" alt="NASA" width={40} height={16} className="object-contain h-4 w-auto opacity-30 brightness-200" />
          <Image src="/logo-bmkg.webp" alt="BMKG" width={34} height={16} className="object-contain h-4 w-auto opacity-30 brightness-200" />
        </div>
        <p className="mb-1">
          <strong className="text-slate-400">PyroAlert Karhutla &apos;26</strong> —
          Data: <a href="https://open-meteo.com" className="hover:text-slate-300 transition-colors">Open-Meteo CAMS (CC BY 4.0)</a>
          {" · "}
          <a href="https://firms.modaps.eosdis.nasa.gov" className="hover:text-slate-300 transition-colors">NASA FIRMS</a>
          {" · "}
          <a href="https://openstreetmap.org" className="hover:text-slate-300 transition-colors">OpenStreetMap (ODbL)</a>
        </p>
        <p>Bukan pengganti informasi resmi BMKG / BNPB / Dinas Kesehatan.</p>
      </footer>
    </div>
  );
}
