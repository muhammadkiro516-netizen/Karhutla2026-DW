"use client";
/**
 * ShareCard — renders a 9:16 (1080×1920) image card via Canvas API.
 * Design: Spotify/Apple Music style — bold gradient background, oversized number,
 * city name, real-time date/time, stats row, source + branding.
 * Outputs a PNG blob → download + Web Share API (WhatsApp, IG Story, etc.)
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, X, MessageCircle, ImageIcon } from "lucide-react";
import type { AirCity, WeatherCity } from "@/types/api";
import type { City } from "@/config/cities";

// ── Canvas dimensions (9:16) ─────────────────────────────────────────────────
const W = 1080;
const H = 1920;

// ── Category colour palette ──────────────────────────────────────────────────
const CAT_PALETTE: Record<string, { bg1: string; bg2: string; accent: string; label: string; emoji: string }> = {
  BAIK:               { bg1: "#052e16", bg2: "#14532d", accent: "#4ade80", label: "BAIK",              emoji: "🟢" },
  SEDANG:             { bg1: "#0c1a2e", bg2: "#1e3a5f", accent: "#60a5fa", label: "SEDANG",            emoji: "🔵" },
  TIDAK_SEHAT:        { bg1: "#1c1200", bg2: "#3d2400", accent: "#fbbf24", label: "TIDAK SEHAT",       emoji: "🟡" },
  SANGAT_TIDAK_SEHAT: { bg1: "#200000", bg2: "#3d0000", accent: "#f87171", label: "SANGAT TDK SEHAT",  emoji: "🔴" },
  BERBAHAYA:          { bg1: "#0a0a0a", bg2: "#1a0000", accent: "#ff4444", label: "BERBAHAYA",         emoji: "⚫" },
};
const DEFAULT_PALETTE = CAT_PALETTE.SEDANG;

// ── School status label ───────────────────────────────────────────────────────
const SCHOOL_LABELS: Record<string, string> = {
  NORMAL: "Sekolah Normal", WASPADA: "Sekolah Waspada",
  HYBRID: "Sekolah Hybrid", DARING_DARURAT: "Sekolah Daring Darurat",
};

// ── Helper: draw rounded rect ─────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── Helper: wrap text ─────────────────────────────────────────────────────────
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number): number {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineH;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, cy);
  return cy + lineH;
}

// ── Main draw function ────────────────────────────────────────────────────────
function drawCard(
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
  const pal = CAT_PALETTE[cat] ?? DEFAULT_PALETTE;
  const ispuVal = air.ispuNow?.value ?? 0;
  const ispuLabel = air.ispuNow?.label ?? "—";
  const ispu24 = air.ispu24h?.value ?? null;
  const pm25 = air.pm25 ?? 0;
  const schoolCode = air.status.code;
  const schoolLabel = SCHOOL_LABELS[schoolCode] ?? air.status.label;

  // ── 1. Background gradient ──
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, pal.bg1);
  bgGrad.addColorStop(0.55, pal.bg2);
  bgGrad.addColorStop(1, "#000000");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── 2. Radial glow behind ISPU number ──
  const glow = ctx.createRadialGradient(W / 2, 820, 80, W / 2, 820, 520);
  glow.addColorStop(0, pal.accent + "28");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 300, W, 1100);

  // ── 3. Top bar — branding ──
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  roundRect(ctx, 52, 70, W - 104, 100, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Flame icon circle
  const flameGrad = ctx.createLinearGradient(88, 90, 88, 150);
  flameGrad.addColorStop(0, "#f97316");
  flameGrad.addColorStop(1, "#dc2626");
  ctx.fillStyle = flameGrad;
  roundRect(ctx, 88, 84, 72, 72, 18);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🔥", 124, 130);
  // Brand name
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px sans-serif";
  ctx.fillText("Pyro", 180, 110);
  ctx.fillStyle = "#f97316";
  ctx.fillText("Alert", 180 + ctx.measureText("Pyro").width + 2, 110);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "24px sans-serif";
  ctx.fillText("Karhutla '26", 180, 148);
  // Timestamp right
  const now = new Date();
  const timeStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: city.tz, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(now) + " " + city.tzLabel;
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.40)";
  ctx.font = "26px sans-serif";
  ctx.fillText(timeStr, W - 80, 130);

  // ── 4. City + province ──
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "38px sans-serif";
  ctx.fillText(city.province.toUpperCase(), W / 2, 290);
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 88px sans-serif`;
  ctx.fillText(city.name.toUpperCase(), W / 2, 390);

  // ── 5. Giant ISPU number ──
  ctx.fillStyle = pal.accent;
  ctx.font = `900 ${ispuVal >= 100 ? 340 : 380}px sans-serif`;
  ctx.fillText(String(ispuVal), W / 2, 820);

  // ── 6. ISPU label pill ──
  ctx.font = "bold 56px sans-serif";
  const labelW = ctx.measureText(ispuLabel.toUpperCase()).width + 80;
  const labelX = W / 2 - labelW / 2;
  ctx.fillStyle = pal.accent + "22";
  roundRect(ctx, labelX, 860, labelW, 90, 45);
  ctx.fill();
  ctx.strokeStyle = pal.accent + "66";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = pal.accent;
  ctx.font = "bold 48px sans-serif";
  ctx.fillText(ispuLabel.toUpperCase(), W / 2, 920);

  // ── 7. Category description ──
  ctx.fillStyle = "rgba(255,255,255,0.60)";
  ctx.font = "38px sans-serif";
  const desc: Record<string, string> = {
    BAIK: "Udara sehat — aman beraktivitas di luar",
    SEDANG: "Bisa keluar, tetap waspada",
    TIDAK_SEHAT: "Kurangi aktivitas di luar rumah",
    SANGAT_TIDAK_SEHAT: "Hindari keluar rumah jika bisa",
    BERBAHAYA: "Tetap di dalam, tutup semua ventilasi",
  };
  ctx.fillText(desc[cat] ?? "", W / 2, 1010);

  // ── 8. Divider ──
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 1060);
  ctx.lineTo(W - 80, 1060);
  ctx.stroke();

  // ── 9. Stats row (3 pills) ──
  const stats = [
    { label: "PM2.5", val: `${pm25.toFixed(1)} µg/m³` },
    { label: "ISPU 24 Jam", val: ispu24 != null ? String(ispu24) : "—" },
    { label: "Suhu", val: weather?.temp != null ? `${Math.round(weather.temp)}°C` : "—" },
  ];
  const pillW = 280;
  const pillGap = (W - 80 * 2 - pillW * 3) / 2;
  stats.forEach((s, i) => {
    const px = 80 + i * (pillW + pillGap);
    const py = 1090;
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    roundRect(ctx, px, py, pillW, 140, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.40)";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.label.toUpperCase(), px + pillW / 2, py + 46);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 46px sans-serif";
    ctx.fillText(s.val, px + pillW / 2, py + 106);
  });
  ctx.textAlign = "center";

  // ── 10. Additional stats row ──
  const stats2 = [
    { label: "Angin", val: weather?.windKmh != null ? `${Math.round(weather.windKmh)} km/j` : "—" },
    { label: "Kelembaban", val: weather?.rh != null ? `${Math.round(weather.rh)}%` : "—" },
    { label: "Status Sekolah", val: schoolCode === "NORMAL" ? "Normal ✓" : schoolCode === "DARING_DARURAT" ? "Daring 🚨" : schoolCode === "HYBRID" ? "Hybrid 🏠" : "Waspada ⚠️" },
  ];
  stats2.forEach((s, i) => {
    const px = 80 + i * (pillW + pillGap);
    const py = 1260;
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    roundRect(ctx, px, py, pillW, 140, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.label.toUpperCase(), px + pillW / 2, py + 44);
    ctx.fillStyle = pal.accent;
    ctx.font = "bold 40px sans-serif";
    ctx.fillText(s.val, px + pillW / 2, py + 106);
  });
  ctx.textAlign = "center";

  // ── 11. School status banner ──
  const bannerY = 1430;
  const bannerColors: Record<string, string> = {
    NORMAL: "#16a34a22", WASPADA: "#2563eb22",
    HYBRID: "#d9770622", DARING_DARURAT: "#dc262622",
  };
  const bannerBorder: Record<string, string> = {
    NORMAL: "#22c55e66", WASPADA: "#60a5fa66",
    HYBRID: "#fb923c66", DARING_DARURAT: "#f87171aa",
  };
  ctx.fillStyle = bannerColors[schoolCode] ?? "rgba(255,255,255,0.05)";
  roundRect(ctx, 80, bannerY, W - 160, 120, 24);
  ctx.fill();
  ctx.strokeStyle = bannerBorder[schoolCode] ?? "rgba(255,255,255,0.15)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 46px sans-serif";
  ctx.fillText("🏫  " + schoolLabel, W / 2, bannerY + 75);

  // ── 12. Date line ──
  const dateStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: city.tz, weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(now);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "34px sans-serif";
  ctx.fillText(dateStr, W / 2, 1605);

  // ── 13. QR-style URL box ──
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  roundRect(ctx, 80, 1640, W - 160, 100, 20);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.50)";
  ctx.font = "30px sans-serif";
  ctx.fillText("📡  eduair.vercel.app/udara?kota=" + city.id, W / 2, 1700);

  // ── 14. Bottom branding ──
  ctx.fillStyle = "rgba(255,255,255,0.20)";
  ctx.beginPath();
  ctx.moveTo(80, 1780);
  ctx.lineTo(W - 80, 1780);
  ctx.stroke();
  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = pal.accent;
  ctx.fillText("PyroAlert Karhutla '26", W / 2, 1830);
  ctx.fillStyle = "rgba(255,255,255,0.30)";
  ctx.font = "28px sans-serif";
  ctx.fillText("by Muhammad Salman Al Farisi · @avlfarizii", W / 2, 1878);
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "24px sans-serif";
  ctx.fillText("Data: Open-Meteo CAMS · NASA FIRMS · estimasi, bukan alat ukur resmi", W / 2, 1916);
}

// ── ShareModal ────────────────────────────────────────────────────────────────
interface ModalProps {
  city: City;
  air: AirCity;
  weather: WeatherCity | undefined;
  onClose: () => void;
}

function ShareModal({ city, air, weather, onClose }: ModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Draw the full-res canvas + a small preview
  useEffect(() => {
    const c = canvasRef.current;
    const p = previewRef.current;
    if (!c || !p) return;
    drawCard(c, city, air, weather);

    // Scale down to preview canvas
    const pCtx = p.getContext("2d");
    if (pCtx) {
      p.width = 270;
      p.height = 480;
      pCtx.drawImage(c, 0, 0, 270, 480);
    }

    // Generate blob URL for sharing
    c.toBlob((blob) => {
      if (blob) setBlobUrl(URL.createObjectURL(blob));
    }, "image/png");

    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBlob = (): Promise<Blob> => new Promise((res, rej) => {
    const c = canvasRef.current;
    if (!c) { rej(new Error("no canvas")); return; }
    c.toBlob(b => b ? res(b) : rej(new Error("blob failed")), "image/png");
  });

  const handleDownload = async () => {
    const blob = await getBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pyroalert-${city.id}-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = await getBlob();
      const file = new File([blob], `pyroalert-${city.id}.png`, { type: "image/png" });
      const canShare = navigator.canShare?.({ files: [file] });
      if (canShare) {
        await navigator.share({
          title: `Udara ${city.name} — PyroAlert`,
          text: `ISPU ${air.ispuNow?.value ?? "—"} (${air.ispuNow?.label ?? "—"}) di ${city.name} sekarang. Cek: eduair.vercel.app`,
          files: [file],
        });
      } else {
        // Fallback: download
        await handleDownload();
      }
    } catch { /* cancelled */ } finally {
      setSharing(false);
    }
  };

  const handleWhatsApp = async () => {
    const text = `🔥 *Udara ${city.name}* sekarang:\n\nISPU: *${air.ispuNow?.value ?? "—"}* — ${air.ispuNow?.label ?? "—"}\nPM2.5: ${air.pm25?.toFixed(1) ?? "—"} µg/m³\nStatus sekolah: ${air.status.label}\n\n📡 Detail real-time: eduair.vercel.app/udara?kota=${city.id}\n\n_via PyroAlert '26 · @avlfarizii_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://eduair.vercel.app/udara?kota=${city.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const cat = air.ispuNow?.category ?? "SEDANG";
  const pal = CAT_PALETTE[cat] ?? DEFAULT_PALETTE;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-sm flex flex-col max-h-[96dvh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: `linear-gradient(160deg, ${pal.bg2}ee, #0a0a0aee)`, borderTop: `1px solid ${pal.accent}33` }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 flex-shrink-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: pal.accent }}>
              Bagikan sebagai gambar
            </p>
            <p className="text-white font-black text-lg leading-tight">{city.name}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Preview canvas — scrollable area */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">
          {/* Hidden full-res canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Visible preview */}
          <div className="flex justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border"
              style={{ borderColor: pal.accent + "44", width: 270, height: 480 }}>
              <canvas ref={previewRef} width={270} height={480} className="block w-full h-full" />
              {/* Shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <p className="text-center text-xs mt-2 pb-1" style={{ color: pal.accent + "99" }}>
            Preview gambar 9:16 · Kualitas penuh saat diunduh
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 px-5 pb-6 flex flex-col gap-2.5 pt-2 border-t border-white/5">
          {/* Main CTA — Share as image */}
          <button onClick={handleShare} disabled={sharing}
            className="flex items-center justify-center gap-3 w-full rounded-2xl py-4 font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            style={{ background: `linear-gradient(90deg, ${pal.accent}, ${pal.accent}bb)`, color: "#000" }}>
            <ImageIcon size={18} />
            {sharing ? "Mempersiapkan…" : "Bagikan ke Instagram / Story"}
          </button>

          {/* WhatsApp */}
          <button onClick={handleWhatsApp}
            className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1fba58] text-white rounded-2xl py-3.5 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
            <MessageCircle size={17} />
            Bagikan via WhatsApp
          </button>

          {/* Download PNG */}
          <button onClick={handleDownload}
            className="flex items-center justify-center gap-3 w-full rounded-2xl py-3.5 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: `1px solid rgba(255,255,255,0.12)` }}>
            <Download size={17} />
            Unduh gambar (PNG)
          </button>

          {/* Copy link */}
          <button onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 text-xs py-2 transition-colors"
            style={{ color: copied ? pal.accent : "rgba(255,255,255,0.30)" }}>
            {copied ? "✓ Link tersalin!" : "Salin link halaman ini"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ── Public trigger button ─────────────────────────────────────────────────────
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
  const pal = CAT_PALETTE[cat] ?? DEFAULT_PALETTE;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between rounded-3xl px-5 py-4 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        style={{
          background: `linear-gradient(135deg, ${pal.bg2}, ${pal.bg1})`,
          border: `1px solid ${pal.accent}33`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: pal.accent + "22", border: `1px solid ${pal.accent}44` }}>
            <Share2 size={18} style={{ color: pal.accent }} />
          </div>
          <div className="text-left">
            <p className="font-black text-sm text-white leading-tight">Bagikan sebagai Gambar</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Instagram Story · WhatsApp · Download</p>
          </div>
        </div>
        {/* Mini preview */}
        <div className="rounded-xl px-3 py-2 text-center flex-shrink-0"
          style={{ background: pal.accent + "18", border: `1px solid ${pal.accent}33` }}>
          <p className="font-black text-xl tabular-nums leading-tight" style={{ color: pal.accent }}>
            {air.ispuNow.value}
          </p>
          <p className="text-[10px]" style={{ color: pal.accent + "99" }}>ISPU</p>
        </div>
      </button>

      {mounted && open && air && (
        <ShareModal city={city} air={air} weather={weather} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
