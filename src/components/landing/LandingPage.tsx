"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRight, Satellite, Wind, School, Flame, ShieldCheck, ArrowDown, MapPin, Clock, Users } from "lucide-react";

const FireScene = dynamic(() => import("./FireScene").then(m => m.FireScene), { ssr: false });

// ── Scroll animation hook ──────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Inline logos ──────────────────────────────────────
function NasaBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#0B3D91] text-white text-xs font-black px-3 py-1.5 rounded-lg tracking-wider">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity=".2"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      NASA
    </span>
  );
}

function BmkgBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#1e7a34] text-white text-xs font-black px-3 py-1.5 rounded-lg tracking-wider">
      BMKG
    </span>
  );
}

function CamsBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#003247] text-white text-xs font-black px-3 py-1.5 rounded-lg tracking-wider">
      Copernicus
    </span>
  );
}

function OsmBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#7EBC6F] text-white text-xs font-black px-3 py-1.5 rounded-lg tracking-wider">
      OpenStreetMap
    </span>
  );
}

// ── Counter animation ─────────────────────────────────
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const { ref, visible } = useInView(0.3);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const step = target / 40;
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(Math.round(cur));
      if (cur >= target) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [visible, target]);
  return <span ref={ref}>{val.toLocaleString("id-ID")}{suffix}</span>;
}

// ── Flow step component ───────────────────────────────
function FlowStep({ n, icon, title, body, color }: { n: string; icon: React.ReactNode; title: string; body: string; color: string }) {
  return (
    <div className={`relative flex gap-4 p-5 rounded-3xl border ${color} bg-white`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black">
        {n}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">{icon}<p className="font-bold text-slate-800">{title}</p></div>
        <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">

      {/* ══ NAV ═══════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-[60px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Flame size={15} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-slate-900 text-[15px]">Pyro<span className="text-orange-500">Alert</span></span>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Karhutla &apos;26</span>
            </div>
            <div className="hidden md:flex items-center gap-2 ml-3 pl-3 border-l border-slate-200">
              <NasaBadge />
              <BmkgBadge />
              <CamsBadge />
            </div>
          </div>
          <Link href="/udara" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-lg">
            Buka App <ChevronRight size={15} />
          </Link>
        </div>
      </header>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden pt-[60px]">
        <FireScene />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85 z-10" />

        <div className={`relative z-20 text-center px-5 max-w-3xl mx-auto transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Data satelit NASA aktif — {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
            Pyro<span className="text-orange-400">Alert</span>
            <br />
            <span className="text-3xl md:text-4xl font-light text-white/70">Karhutla &apos;26</span>
          </h1>

          <p className="text-lg md:text-xl text-white/85 mb-3 leading-relaxed">
            Sistem peringatan kebakaran hutan real-time berbasis<br className="hidden md:block" />
            satelit NASA, kualitas udara Copernicus, dan cuaca BMKG
          </p>

          <p className="text-sm text-white/55 mb-10 max-w-xl mx-auto">
            Untuk orang tua, kepala sekolah, petugas posko, dan warga terdampak asap di Kalimantan & Sumatera.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/udara"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all">
              Pantau Sekarang
              <ChevronRight size={18} />
            </Link>
            <Link href="/titik-api"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105 backdrop-blur-sm">
              <Satellite size={18} />
              Lihat Peta Satelit
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/40 animate-bounce">
          <ArrowDown size={24} />
        </div>
      </section>

      {/* ══ DATA PARTNERS STRIP ═══════════════════════════════════ */}
      <section className="bg-slate-950 border-y border-slate-800 py-5 px-5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6">
          <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Sumber Data Resmi</span>
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <NasaBadge />
            <span className="text-xs text-slate-400">FIRMS VIIRS — 3 satelit</span>
          </div>
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <CamsBadge />
            <span className="text-xs text-slate-400">CAMS Air Quality</span>
          </div>
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <BmkgBadge />
            <span className="text-xs text-slate-400">Referensi ambang batas</span>
          </div>
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <OsmBadge />
            <span className="text-xs text-slate-400">Fasilitas kesehatan</span>
          </div>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════ */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-center text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Fakta Karhutla 2023</p>
            <h2 className="text-center text-3xl md:text-4xl font-black text-slate-900 mb-12">
              Satu musim kemarau.<br />Ribuan jam udara berbahaya.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: 253, suffix: " jam", label: "Daring Darurat di Palangka Raya (Sep–Okt 2023)", color: "text-red-500" },
              { n: 40,  suffix: " klaster", label: "Titik api aktif terdeteksi rata-rata per hari", color: "text-orange-500" },
              { n: 128, suffix: " sekolah", label: "Sekolah dipantau di 8 kota rawan karhutla", color: "text-blue-600" },
              { n: 8,   suffix: " kota", label: "Kota dipantau dari Pekanbaru hingga Bandung", color: "text-emerald-600" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="text-center p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <p className={`text-4xl font-black mb-2 ${s.color}`}>
                    <AnimatedNumber target={s.n} suffix={s.suffix} />
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STORY: MASALAH ════════════════════════════════════════ */}
      <section className="py-20 px-5 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Masalah Nyata</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
              Setiap September, pertanyaan yang sama selalu muncul:
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[
              { Icon: Users, q: '"Apakah aman kirim anak ke sekolah hari ini?"', who: "Orang tua & wali murid", color: "border-orange-200 bg-orange-50" },
              { Icon: School, q: '"Data mana yang saya pakai untuk memutuskan meliburkan sekolah?"', who: "Kepala Sekolah & Dinas", color: "border-blue-200 bg-blue-50" },
              { Icon: Wind, q: '"Dari arah mana asap datang dan seberapa cepat?"', who: "Petugas posko & relawan", color: "border-red-200 bg-red-50" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className={`rounded-3xl border-2 ${item.color} p-6`}>
                  <item.Icon size={24} className="text-slate-400 mb-3" />
                  <p className="text-base font-bold text-slate-800 mb-3 leading-snug italic">{item.q}</p>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.who}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <p className="text-center text-slate-500 text-base mt-10 max-w-2xl mx-auto leading-relaxed">
              Informasi ada di mana-mana — BMKG, BNPB, LAPAN, stasiun lokal — tapi terpencar-pencar
              dan sulit dipahami warga biasa. <strong className="text-slate-800">PyroAlert menyatukan semuanya dalam satu tampilan yang bisa langsung diambil tindakan.</strong>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ ALUR SISTEM ═══════════════════════════════════════════ */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 text-center">Cara Kerja Sistem</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 text-center">
              Dari satelit di angkasa<br />ke keputusan di tangan kamu
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
              4 langkah otomatis — dari deteksi api oleh NASA sampai rekomendasi status sekolah yang bisa disetujui Kepala Sekolah.
            </p>
          </Reveal>

          <div className="flex flex-col gap-4">
            <Reveal delay={0}>
              <FlowStep n="1" color="border-blue-100"
                icon={<Satellite size={16} className="text-blue-500" />}
                title="Satelit NASA memindai seluruh Indonesia setiap 12 jam"
                body="3 satelit VIIRS — SNPP, NOAA-20, dan NOAA-21 — mendeteksi panas permukaan bumi. Data dikirim ke server NASA dalam hitungan jam, lalu kita ambil dan proses. Ini bukan perkiraan: ini hotspot yang benar-benar terdeteksi dari luar angkasa." />
            </Reveal>
            <div className="flex justify-center"><div className="w-px h-8 bg-slate-200" /></div>

            <Reveal delay={100}>
              <FlowStep n="2" color="border-sky-100"
                icon={<Wind size={16} className="text-sky-500" />}
                title="Model atmosfer Copernicus CAMS hitung kualitas udara"
                body="Sistem CAMS (Copernicus Atmosphere Monitoring Service) Eropa memproses partikel PM2.5 di udara berdasarkan model atmosfer 40 km. Diperbarui setiap jam. Hasilnya kita konversi ke ISPU (Indeks Standar Pencemar Udara) sesuai Permen LHK P.14/2020 punya pemerintah Indonesia." />
            </Reveal>
            <div className="flex justify-center"><div className="w-px h-8 bg-slate-200" /></div>

            <Reveal delay={200}>
              <FlowStep n="3" color="border-amber-100"
                icon={<Flame size={16} className="text-amber-500" />}
                title="Engine hitung status sekolah & simulasi arah asap"
                body="Sistem secara otomatis menghitung apakah udara di kota kamu aman untuk sekolah. Ambang batas: Waspada (ISPU >100 selama 1 jam), Hybrid (>150 selama 3 jam), Daring Darurat (>200 selama 2 jam). Plus simulasi sederhana: dari titik api mana asap bisa sampai ke kotamu berdasarkan arah angin saat ini." />
            </Reveal>
            <div className="flex justify-center"><div className="w-px h-8 bg-slate-200" /></div>

            <Reveal delay={300}>
              <FlowStep n="4" color="border-emerald-100"
                icon={<ShieldCheck size={16} className="text-emerald-500" />}
                title="Kepala Sekolah setujui — baru jadi keputusan resmi"
                body="Sistem hanya memberikan rekomendasi. Status resmi berlaku setelah Kepala Sekolah atau Dinas Pendidikan menekan tombol 'Setujui'. Setiap keputusan dicatat dalam log audit yang tidak bisa diubah (hash-chain). Pengumuman langsung bisa dikirim via WhatsApp." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ FITUR TABS ════════════════════════════════════════════ */}
      <section className="py-20 px-5 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3 text-center">4 Tab Utama</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">
              Satu app, semua yang kamu butuhkan
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { Icon: Wind, color: "from-blue-600 to-sky-500", shadow: "shadow-blue-500/20", label: "Tab Udara", desc: "Nilai ISPU per jam + grafik 48 jam ke depan. Langsung tahu kondisi udara di kotamu dan apa yang harus dilakukan sekarang.", badge: "CAMS Copernicus" },
              { Icon: School, color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20", label: "Tab Sekolah", desc: "128 sekolah di 8 kota. Status rekomendasi otomatis, persetujuan kepala sekolah, log audit, QR poster, pengumuman WhatsApp.", badge: "128 sekolah" },
              { Icon: Flame, color: "from-orange-500 to-red-500", shadow: "shadow-orange-500/20", label: "Tab Titik Api", desc: "Peta interaktif titik api satelit NASA. Klaster, ranking ancaman per kota, simulasi sebaran asap berdasarkan arah angin.", badge: "NASA FIRMS" },
              { Icon: MapPin, color: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/20", label: "Tab Posko", desc: "40 fasilitas kesehatan (RS, Puskesmas, Apotek, Posko BPBD) terdekat. Stok APD real-time. Laporan warga dengan verifikasi foto EXIF.", badge: "OpenStreetMap" },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className={`rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl ${f.shadow}`}>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <f.Icon size={22} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-base font-black text-white">{f.label}</p>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-wide">{f.badge}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BACKTEST RESULT ═══════════════════════════════════════ */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Hasil Evaluasi Nyata</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 text-center">
              Kami uji engine-nya dengan data historis 2023
            </h2>
            <p className="text-slate-400 text-center mb-10 max-w-xl mx-auto">
              Backtest dilakukan dengan data PM2.5 historis September–Oktober 2023 (1.464 jam per kota). Hasilnya konsisten dengan laporan lapangan saat itu.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { city: "Palangka Raya", prov: "Kalimantan Tengah", daring: 253, waspada: 355, normal: 770, note: "Kebakaran gambut masif Kalteng 2023" },
              { city: "Jambi", prov: "Provinsi Jambi", daring: 0, waspada: 12, normal: 1452, note: "Musim kemarau lebih ringan" },
              { city: "Pekanbaru", prov: "Riau", daring: 0, waspada: 61, normal: 1403, note: "Asap kiriman dari Kalteng" },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="rounded-3xl border border-slate-200 p-5">
                  <p className="text-base font-black text-slate-800">{c.city}</p>
                  <p className="text-xs text-slate-400 mb-4">{c.prov}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-500 font-semibold">Daring Darurat</span>
                      <span className="font-bold tabular-nums">{c.daring} jam</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${(c.daring/1464)*100}%` }} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-500 font-semibold">Waspada/Hybrid</span>
                      <span className="font-bold tabular-nums">{c.waspada} jam</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(c.waspada/1464)*100}%` }} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-500 font-semibold">Normal</span>
                      <span className="font-bold tabular-nums">{c.normal} jam</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(c.normal/1464)*100}%` }} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 italic">{c.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JUJUR SOAL BATASAN ════════════════════════════════════ */}
      <section className="py-20 px-5 bg-amber-50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 text-center">Jujur Tentang Batasan</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center">
              Ini yang perlu kamu tahu sebelum pakai PyroAlert
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "CAMS ≠ alat ukur langsung", body: "Model atmosfer 40 km per piksel. Nilainya estimasi, bukan pengukuran stasiun ISPU resmi. Selisih bisa 20–40% dengan kondisi aktual." },
              { title: "Titik panas ≠ kebakaran terkonfirmasi", body: "Satelit mendeteksi panas permukaan. Bisa berupa jalan beraspal panas, pabrik, atau lahan gambut yang membara di bawah tanah." },
              { title: "Simulasi asap sangat sederhana", body: "Model drift kami hanya menggunakan arah angin satu titik, bukan model dispersi atmosfer seperti yang dipakai BMKG/BNPB." },
              { title: "Bukan pengganti informasi resmi", body: "Selalu cek BMKG, BNPB, dan Dinas Kesehatan setempat untuk keputusan darurat. PyroAlert adalah alat bantu, bukan autoritas resmi." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="bg-white rounded-2xl border border-amber-200 p-5">
                  <p className="font-bold text-slate-800 mb-1">{item.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════ */}
      <section className="py-24 px-5 bg-slate-950 text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-3 mb-6">
            <NasaBadge /> <CamsBadge /> <BmkgBadge />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Gratis. Real-time.<br />
            <span className="text-orange-400">Mulai sekarang.</span>
          </h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto">
            Tidak perlu daftar akun. Tidak perlu install apapun. Buka dan langsung pantau.
          </p>
          <Link href="/udara"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all">
            Pantau Kondisi Udara Sekarang
            <ChevronRight size={22} />
          </Link>
          <p className="text-slate-600 text-xs mt-6 flex items-center justify-center gap-2">
            <Clock size={12} /> Data diperbarui setiap 10–15 menit
          </p>
        </Reveal>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-5 text-center text-xs text-slate-600">
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
