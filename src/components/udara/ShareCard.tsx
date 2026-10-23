"use client";
/**
 * ShareCard — canvas-rendered 1080×1920 (9:16) share image.
 *
 * Design language: clean white card on muted background — Apple/Spotify feel.
 * Palette: white base, slate text, single accent colour from ISPU category.
 * Fire animation: subtle animated canvas "ember" dots in the card's accent zone.
 *
 * Image sharing: canvas.toBlob() → File → navigator.share({ files })
 * Fallback (desktop / unsupported): auto-download the PNG.
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, X, MessageCircle } from "lucide-react";
import type { AirCity, WeatherCity } from "@/types/api";
import type { City } from "@/config/cities";

// ── ISPU accent colours (single bold colour per category) ────────────────────
const ACCENTS: Record<string, { hex: string; r: number; g: number; b: number; label: string }> = {
  BAIK:               { hex: "#16a34a", r: 22,  g: 163, b: 74,  label: "BAIK" },
  SEDANG:             { hex: "#2563eb", r: 37,  g: 99,  b: 235, label: "SEDANG" },
  TIDAK_SEHAT:        { hex: "#d97706", r: 217, g: 119, b: 6,   label: "TIDAK SEHAT" },
  SANGAT_TIDAK_SEHAT: { hex: "#dc2626", r: 220, g: 38,  b: 38,  label: "SGT TDK SEHAT" },
  BERBAHAYA:          { hex: "#0f172a", r: 15,  g: 23,  b: 42,  label: "BERBAHAYA" },
};
const FALLBACK_ACCENT = ACCENTS.SEDANG;

const SCHOOL_SHORT: Record<string, string> = {
  NORMAL: "Normal ✓", WASPADA: "Waspada ⚠", HYBRID: "Hybrid 🏠", DARING_DARURAT: "Darurat 🚨",
};

// ── Canvas helpers ────────────────────────────────────────────────────────────
const W = 1080;
const H = 1920;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
}

// ── Draw function ─────────────────────────────────────────────────────────────
function drawShareCard(
  canvas: HTMLCanvasElement,
  city: City,
  air: AirCity,
  weather: WeatherCity | undefined,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;

  const cat = air.ispuNow?.category ?? "SEDANG";
  const acc = ACCENTS[cat] ?? FALLBACK_ACCENT;
  const ispu = air.ispuNow?.value ?? 0;
  const pm25 = air.pm25 ?? 0;
  const ispu24 = air.ispu24h?.value ?? null;
  const temp = weather?.temp != null ? `${Math.round(weather.temp)}°C` : "—";
  const wind = weather?.windKmh != null ? `${Math.round(weather.windKmh)} km/j` : "—";
  const rh   = weather?.rh    != null ? `${Math.round(weather.rh)}%`  : "—";
  const school = SCHOOL_SHORT[air.status.code] ?? air.status.label;

  const now = new Date();
  const dateStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: city.tz, weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(now);
  const timeStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: city.tz, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(now) + " " + city.tzLabel;

  // ── 1. Off-white background ──
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, W, H);

  // ── 2. Large accent colour block (top ~55%) ──
  const blockH = 1060;
  rr(ctx, 0, 0, W, blockH + 80, 0);
  ctx.fillStyle = acc.hex;
  ctx.fill();

  // ── 3. Soft noise-like grain (simulate texture) using semi-transparent white dots ──
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let i = 0; i < 1800; i++) {
    const gx = Math.random() * W;
    const gy = Math.random() * blockH;
    const gr = Math.random() * 2.5 + 0.5;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── 4. White card floating in the middle ──
  const cardX = 64;
  const cardY = blockH - 220;
  const cardW = W - 128;
  const cardH = 860;
  ctx.shadowColor = "rgba(0,0,0,0.12)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 20;
  rr(ctx, cardX, cardY, cardW, cardH, 52);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Card inner accent bar (top edge of card)
  rr(ctx, cardX, cardY, cardW, 12, 6);
  ctx.fillStyle = acc.hex;
  ctx.fill();

  // ── 5. Top section (on accent block) ──
  // Brand pill
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  rr(ctx, 64, 72, 380, 80, 40);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("🔥  PyroAlert '26", 100, 123);

  // Time top-right
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "30px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText(timeStr, W - 64, 123);

  // City name
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "38px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText(city.province.toUpperCase(), W / 2, 240);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${city.name.length > 10 ? 78 : 96}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillText(city.name, W / 2, 350);

  // ISPU number — oversized
  ctx.font = `900 ${ispu >= 300 ? 300 : 340}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(String(ispu), W / 2, 720);

  // ISPU label
  ctx.font = "bold 52px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.80)";
  ctx.fillText(acc.label, W / 2, 800);

  // ── 6. Card content ──
  const cCX = cardX + cardW / 2;

  // Card header — ISPU description
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";

  const descMap: Record<string, string> = {
    BAIK: "Udara Sehat — Aman Beraktivitas",
    SEDANG: "Bisa Keluar, Tetap Waspada",
    TIDAK_SEHAT: "Kurangi Aktivitas di Luar",
    SANGAT_TIDAK_SEHAT: "Hindari Keluar Rumah",
    BERBAHAYA: "Tetap di Dalam Rumah",
  };
  ctx.fillText(descMap[cat] ?? "", cCX, cardY + 112);

  // Divider
  ctx.strokeStyle = "#f1f5f9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 60, cardY + 150);
  ctx.lineTo(cardX + cardW - 60, cardY + 150);
  ctx.stroke();

  // Stats grid — 3 columns × 2 rows
  const statData = [
    { label: "PM2.5", val: `${pm25.toFixed(1)}`, unit: "µg/m³" },
    { label: "ISPU 24 jam", val: ispu24 != null ? String(ispu24) : "—", unit: "" },
    { label: "Suhu", val: temp, unit: "" },
    { label: "Angin", val: wind, unit: "" },
    { label: "Kelembaban", val: rh, unit: "" },
    { label: "Sekolah", val: school, unit: "" },
  ];
  const cols = 3;
  const cellW = (cardW - 80) / cols;
  const cellH = 170;
  const gridStartX = cardX + 40;
  const gridStartY = cardY + 185;

  statData.forEach((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = gridStartX + col * cellW + cellW / 2;
    const cy = gridStartY + row * cellH;

    // Cell bg
    ctx.fillStyle = col === 0 ? `rgba(${acc.r},${acc.g},${acc.b},0.05)` : "#f8fafc";
    rr(ctx, gridStartX + col * cellW + 6, cy + 6, cellW - 12, cellH - 16, 20);
    ctx.fill();

    // Label
    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.label.toUpperCase(), cx, cy + 46);

    // Value
    ctx.fillStyle = i === 5 ? acc.hex : "#0f172a";
    ctx.font = `bold ${s.val.length > 8 ? 32 : 42}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    ctx.fillText(s.val + s.unit, cx, cy + 106);
  });

  // ── 7. Date strip ──
  const dateY = cardY + 570;
  ctx.fillStyle = "#f1f5f9";
  rr(ctx, cardX + 48, dateY, cardW - 96, 70, 16);
  ctx.fill();
  ctx.fillStyle = "#64748b";
  ctx.font = "28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("📅  " + dateStr, cCX, dateY + 46);

  // ── 8. URL strip ──
  ctx.fillStyle = "#f8fafc";
  rr(ctx, cardX + 48, dateY + 90, cardW - 96, 60, 16);
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.font = "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("🔗  eduair.vercel.app/udara?kota=" + city.id, cCX, dateY + 129);

  // ── 9. Card footer ──
  const footerY = cardY + 780;
  ctx.strokeStyle = "#f1f5f9";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cardX + 60, footerY);
  ctx.lineTo(cardX + cardW - 60, footerY);
  ctx.stroke();

  ctx.fillStyle = acc.hex;
  ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("PyroAlert Karhutla '26", cCX, footerY + 44);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("by Muhammad Salman Al Farisi · @avlfarizii", cCX, footerY + 80);

  // ── 10. Bottom of page ──
  ctx.fillStyle = "#94a3b8";
  ctx.font = "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("Data estimasi CAMS · Bukan alat ukur resmi BMKG", W / 2, H - 60);
}

// ── Preview component ─────────────────────────────────────────────────────────
function CardPreview({
  city, air, weather,
}: { city: City; air: AirCity; weather: WeatherCity | undefined }) {
  const fullRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const full = fullRef.current;
    const prev = previewRef.current;
    if (!full || !prev) return;
    drawShareCard(full, city, air, weather);
    const ctx = prev.getContext("2d");
    if (ctx) {
      prev.width = 324;
      prev.height = 576;
      ctx.drawImage(full, 0, 0, 324, 576);
    }
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <canvas ref={fullRef} className="hidden" />
      <div className={`transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}>
        <canvas ref={previewRef} width={324} height={576}
          className="w-full rounded-3xl shadow-2xl" style={{ aspectRatio: "9/16" }} />
      </div>
    </>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  city: City; air: AirCity; weather: WeatherCity | undefined; onClose: () => void;
}

function ShareModal({ city, air, weather, onClose }: ModalProps) {
  const fullCanvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");

  useEffect(() => {
    const full = fullCanvasRef.current;
    if (!full) return;
    drawShareCard(full, city, air, weather);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Always returns a PNG blob from the full-res canvas
  const getBlob = (): Promise<Blob> => new Promise((res, rej) => {
    const c = fullCanvasRef.current;
    if (!c) { rej(new Error("no canvas")); return; }
    c.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), "image/png");
  });

  // Download the PNG
  const download = async () => {
    setStatus("working");
    try {
      const blob = await getBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `pyroalert-${city.id}.png`; a.click();
      URL.revokeObjectURL(url);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    } catch { setStatus("idle"); }
  };

  // Share image file — covers IG Story, WA Status, etc.
  const shareImage = async () => {
    setStatus("working");
    try {
      const blob = await getBlob();
      const file = new File([blob], `pyroalert-${city.id}.png`, { type: "image/png" });
      // Check if sharing files is supported
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Udara ${city.name} — PyroAlert`,
          text: `ISPU ${air.ispuNow?.value ?? "—"} (${air.ispuNow?.label ?? "—"}) di ${city.name}`,
          files: [file],
        });
        setStatus("done");
      } else {
        // Not supported (desktop) — fall back to download
        await download();
        return;
      }
    } catch { /* user cancelled */ } finally {
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  // WhatsApp — share image file if possible, else text link
  const shareWhatsApp = async () => {
    setStatus("working");
    try {
      const blob = await getBlob();
      const file = new File([blob], `pyroalert-${city.id}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Udara ${city.name}` });
        setStatus("done");
        setTimeout(() => setStatus("idle"), 2000);
        return;
      }
    } catch { /* fall through to text */ }
    // Fallback: text link
    const txt = `🔥 *Udara ${city.name}* sekarang ISPU *${air.ispuNow?.value ?? "—"}* (${air.ispuNow?.label ?? "—"})\n\n📡 Detail: https://eduair.vercel.app/udara?kota=${city.id}\n\nvia @avlfarizii`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
    setStatus("idle");
  };

  const cat = air.ispuNow?.category ?? "SEDANG";
  const acc = ACCENTS[cat] ?? FALLBACK_ACCENT;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-[400px] bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[96dvh] flex flex-col">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: acc.hex }}>
              Bagikan sebagai gambar 9:16
            </p>
            <p className="text-slate-900 font-black text-lg leading-tight">{city.name}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Scrollable preview */}
        <div className="flex-1 overflow-y-auto px-5 pb-2 min-h-0">
          {/* Full-res hidden canvas */}
          <canvas ref={fullCanvasRef} className="hidden" />

          {/* Preview drawn fresh in this modal */}
          <PreviewInModal city={city} air={air} weather={weather} />

          <p className="text-center text-[10px] text-slate-400 mt-2">
            Preview · Unduh untuk kualitas penuh 1080×1920
          </p>
        </div>

        {/* Buttons */}
        <div className="flex-shrink-0 px-5 pb-6 pt-3 flex flex-col gap-2.5 border-t border-slate-100">

          {/* Share image (IG Story / native) */}
          <button onClick={shareImage} disabled={status === "working"}
            className="flex items-center justify-center gap-2.5 w-full rounded-2xl py-4 font-black text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            style={{ background: `linear-gradient(90deg, ${acc.hex}, ${acc.hex}dd)` }}>
            <Share2 size={17} />
            {status === "working" ? "Memproses…" : status === "done" ? "Berhasil! ✓" : "Bagikan Gambar (IG Story / lainnya)"}
          </button>

          {/* WhatsApp */}
          <button onClick={shareWhatsApp} disabled={status === "working"}
            className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1db954] text-white rounded-2xl py-3.5 font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50">
            <MessageCircle size={17} />
            Bagikan via WhatsApp
          </button>

          {/* Download */}
          <button onClick={download} disabled={status === "working"}
            className="flex items-center justify-center gap-2.5 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl py-3.5 font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50">
            <Download size={17} />
            Unduh PNG ke galeri
          </button>

          <p className="text-center text-[10px] text-slate-400 leading-relaxed px-2">
            💡 Setelah unduh, buka galeri → share ke Instagram Story / WhatsApp Status
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Small preview component inside modal (draws on its own canvas)
function PreviewInModal({ city, air, weather }: { city: City; air: AirCity; weather: WeatherCity | undefined }) {
  const fullRef = useRef<HTMLCanvasElement>(null);
  const prevRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const full = fullRef.current;
    const prev = prevRef.current;
    if (!full || !prev) return;
    drawShareCard(full, city, air, weather);
    const pCtx = prev.getContext("2d");
    if (pCtx) {
      prev.width = 324;
      prev.height = 576;
      pCtx.drawImage(full, 0, 0, 324, 576);
    }
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`flex justify-center transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}>
      <canvas ref={fullRef} className="hidden" />
      <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100" style={{ width: 270, height: 480 }}>
        <canvas ref={prevRef} width={324} height={576} className="block" style={{ width: 270, height: 480 }} />
      </div>
    </div>
  );
}

// ── Public trigger ────────────────────────────────────────────────────────────
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
  const acc = ACCENTS[cat] ?? FALLBACK_ACCENT;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between rounded-3xl bg-white border border-slate-200 hover:border-slate-300 px-5 py-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-px group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
            style={{ background: `${acc.hex}15`, border: `1.5px solid ${acc.hex}30` }}>
            <Share2 size={17} style={{ color: acc.hex }} />
          </div>
          <div className="text-left">
            <p className="font-black text-sm text-slate-800 leading-tight">Bagikan sebagai Gambar</p>
            <p className="text-xs text-slate-400">IG Story · WA Status · Download PNG</p>
          </div>
        </div>
        <div className="rounded-xl px-3 py-2 text-center flex-shrink-0"
          style={{ background: `${acc.hex}10`, border: `1.5px solid ${acc.hex}25` }}>
          <p className="font-black text-lg tabular-nums leading-tight" style={{ color: acc.hex }}>
            {air.ispuNow.value}
          </p>
          <p className="text-[10px] text-slate-400">ISPU</p>
        </div>
      </button>

      {mounted && open && air && (
        <ShareModal city={city} air={air} weather={weather} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

// Export preview for potential standalone use
export { CardPreview };
