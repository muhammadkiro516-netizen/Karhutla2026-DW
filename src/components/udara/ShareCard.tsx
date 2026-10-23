"use client";
/**
 * ShareCard — generates a beautiful city air quality card for sharing.
 * Uses Web Share API (WhatsApp, Instagram Story, etc.) with text + URL fallback.
 * The visible card preview is also rendered so users see exactly what they share.
 */
import { useEffect, useRef, useState } from "react";
import { Share2, Copy, Check, MessageCircle, ImageIcon, X } from "lucide-react";
import { createPortal } from "react-dom";
import type { AirCity, WeatherCity } from "@/types/api";
import type { City } from "@/config/cities";

// ── helpers ──────────────────────────────────────────────────────────────────
function formatDateId(d: Date, tz: string) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: tz,
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(d);
}
function formatTimeId(d: Date, tz: string, tzLabel: string) {
  const t = new Intl.DateTimeFormat("id-ID", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d);
  return `${t} ${tzLabel}`;
}

function ispuGradient(cat: string): string {
  return {
    BAIK: "from-emerald-600 to-teal-600",
    SEDANG: "from-blue-600 to-sky-600",
    TIDAK_SEHAT: "from-amber-500 to-orange-600",
    SANGAT_TIDAK_SEHAT: "from-red-600 to-rose-700",
    BERBAHAYA: "from-gray-900 to-red-950",
  }[cat] ?? "from-slate-600 to-slate-800";
}
function ispuEmoji(cat: string): string {
  return { BAIK: "🟢", SEDANG: "🔵", TIDAK_SEHAT: "🟡", SANGAT_TIDAK_SEHAT: "🔴", BERBAHAYA: "⚫" }[cat] ?? "⚪";
}
function schoolEmoji(code: string): string {
  return { NORMAL: "✅", WASPADA: "⚠️", HYBRID: "🏠", DARING_DARURAT: "🚨" }[code] ?? "📋";
}

// ── share text builder ────────────────────────────────────────────────────────
function buildShareText(p: {
  cityName: string; province: string;
  ispuNow: number; ispuLabel: string; category: string;
  pm25: number; ispu24h: number | null;
  schoolCode: string; schoolLabel: string;
  temp: number | null; windKmh: number | null;
  date: string; time: string; tzLabel: string;
  url: string;
}): string {
  const header = `${ispuEmoji(p.category)} KONDISI UDARA ${p.cityName.toUpperCase()}`;
  const lines = [
    header,
    `📍 ${p.cityName}, ${p.province}`,
    `📅 ${p.date} · ${p.time}`,
    ``,
    `🌫️ ISPU Sekarang : ${p.ispuNow} — ${p.ispuLabel}`,
    `📊 PM2.5 : ${p.pm25.toFixed(1)} µg/m³`,
    p.ispu24h != null ? `📉 Rata-rata 24 jam : ${p.ispu24h}` : "",
    ``,
    `🏫 Status Sekolah : ${schoolEmoji(p.schoolCode)} ${p.schoolLabel}`,
    p.temp != null ? `🌡️ Suhu : ${Math.round(p.temp)}°C` : "",
    p.windKmh != null ? `💨 Angin : ${Math.round(p.windKmh)} km/jam` : "",
    ``,
    `🔗 Data real-time: ${p.url}`,
    ``,
    `via PyroAlert Karhutla '26 · @avlfarizii`,
    `⚠️ Data estimasi CAMS, bukan alat ukur resmi.`,
  ].filter(Boolean);
  return lines.join("\n");
}

// ── ShareModal ────────────────────────────────────────────────────────────────
interface ShareModalProps {
  city: City;
  air: AirCity;
  weather: WeatherCity | undefined;
  onClose: () => void;
}

function ShareModal({ city, air, weather, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const date = formatDateId(now, city.tz);
  const time = formatTimeId(now, city.tz, city.tzLabel);
  const cat = air.ispuNow?.category ?? "SEDANG";
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/udara?kota=${city.id}` : `https://eduair.vercel.app/udara?kota=${city.id}`;

  const shareText = buildShareText({
    cityName: city.name, province: city.province,
    ispuNow: air.ispuNow?.value ?? 0,
    ispuLabel: air.ispuNow?.label ?? "Tidak ada data",
    category: cat,
    pm25: air.pm25 ?? 0,
    ispu24h: air.ispu24h?.value ?? null,
    schoolCode: air.status.code,
    schoolLabel: air.status.label,
    temp: weather?.temp ?? null,
    windKmh: weather?.windKmh ?? null,
    date, time, tzLabel: city.tzLabel,
    url,
  });

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: `Udara ${city.name} — PyroAlert`, text: shareText, url });
    } catch { /* user cancelled */ }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener");
  };

  const handleTwitter = () => {
    const tweet = `${ispuEmoji(cat)} Udara ${city.name} sekarang ISPU ${air.ispuNow?.value ?? "—"} (${air.ispuNow?.label ?? "—"}) — ${date}\n\nPantau real-time: ${url}\n\nvia @avlfarizii #PyroAlert #Karhutla`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank", "noopener");
  };

  const grad = ispuGradient(cat);

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center sm:justify-center px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "92dvh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Bagikan kondisi udara</p>
            <p className="text-base font-black text-slate-800">{city.name}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Preview card */}
        <div className="px-5 pb-3">
          <div ref={cardRef}
            className={`rounded-3xl bg-gradient-to-br ${grad} p-5 shadow-lg overflow-hidden relative`}>

            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center">
                    <span className="text-[10px]">🔥</span>
                  </div>
                  <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">PyroAlert '26</span>
                </div>
                <p className="text-white font-black text-lg leading-tight">{city.name}</p>
                <p className="text-white/60 text-[11px]">{city.province}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50">{time}</p>
                <p className="text-[9px] text-white/30 mt-0.5">{date.split(",")[0]}</p>
              </div>
            </div>

            {/* Big ISPU */}
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-[64px] font-black text-white leading-none tabular-nums drop-shadow-lg">
                  {air.ispuNow?.value ?? "—"}
                </p>
                <p className="text-white font-bold text-base">{air.ispuNow?.label ?? "—"}</p>
                <p className="text-white/70 text-xs">{air.status.label} · Sekolah</p>
              </div>
              {air.ispu24h && (
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2 text-center border border-white/20">
                  <p className="text-[9px] text-white/60 font-semibold uppercase tracking-wide">24 jam</p>
                  <p className="text-2xl font-black text-white tabular-nums">{air.ispu24h.value}</p>
                  <p className="text-[9px] text-white/70">{air.ispu24h.label}</p>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "PM2.5", val: air.pm25 != null ? `${air.pm25.toFixed(1)} µg` : "—" },
                { label: "Suhu", val: weather?.temp != null ? `${Math.round(weather.temp)}°C` : "—" },
                { label: "Angin", val: weather?.windKmh != null ? `${Math.round(weather.windKmh)} km/j` : "—" },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-2 py-1.5 text-center">
                  <p className="text-[9px] text-white/50 font-semibold uppercase tracking-wide">{s.label}</p>
                  <p className="text-sm font-black text-white tabular-nums">{s.val}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
              <p className="text-[9px] text-white/30">eduair.vercel.app</p>
              <p className="text-[9px] text-white/30">@avlfarizii · Data: CAMS+NASA</p>
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="px-5 pb-5 flex flex-col gap-2">
          {/* WhatsApp — most used in Indonesia */}
          <button onClick={handleWhatsApp}
            className="flex items-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl px-4 py-3 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
            <MessageCircle size={18} />
            <span>Bagikan via WhatsApp</span>
          </button>

          {/* Native share (covers IG Story, dll) */}
          {canNativeShare && (
            <button onClick={handleNativeShare}
              className="flex items-center gap-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl px-4 py-3 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
              <ImageIcon size={18} />
              <span>Bagikan ke Instagram / lainnya</span>
            </button>
          )}

          {/* Twitter / X */}
          <button onClick={handleTwitter}
            className="flex items-center gap-3 w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-4 py-3 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] border border-slate-700">
            <Share2 size={18} />
            <span>Bagikan ke X / Twitter</span>
          </button>

          {/* Copy text */}
          <button onClick={handleCopy}
            className="flex items-center gap-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl px-4 py-3 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
            {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
            <span>{copied ? "Teks disalin!" : "Salin teks laporan"}</span>
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-slate-400 text-center px-5 pb-4 leading-relaxed">
          Data ISPU bersifat estimasi (model CAMS 40 km), bukan alat ukur resmi BMKG.
          Selalu cek informasi resmi untuk keputusan darurat.
        </p>
      </div>
    </div>,
    document.body,
  );
}

// ── Public component ──────────────────────────────────────────────────────────
interface ShareCardProps {
  city: City;
  air: AirCity | undefined;
  weather: WeatherCity | undefined;
}

export function ShareCard({ city, air, weather }: ShareCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!air?.ispuNow) return null;

  const cat = air.ispuNow.category;
  const grad = ispuGradient(cat);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={`w-full flex items-center justify-between rounded-3xl bg-gradient-to-r ${grad} px-5 py-4 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Share2 size={18} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-black text-sm">Bagikan ke Story / Status</p>
            <p className="text-white/70 text-xs">WhatsApp · Instagram · Twitter</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-xl px-3 py-1.5 text-center">
          <p className="text-white font-black text-lg tabular-nums">{air.ispuNow.value}</p>
          <p className="text-white/70 text-[10px]">ISPU</p>
        </div>
      </button>

      {/* Modal */}
      {mounted && open && air && (
        <ShareModal city={city} air={air} weather={weather} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
