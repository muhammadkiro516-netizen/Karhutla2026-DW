"use client";
/**
 * ShareCard — animated preview canvas + static 1080×1920 PNG export.
 *
 * Design: fire-sky scene (like the landing hero) as full background,
 * frosted-glass white card in the lower 60%, character with mask per ISPU level,
 * ember particle animation on the live preview.
 *
 * Export: canvas.toBlob() → File → navigator.share({files}) or download.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, X, MessageCircle } from "lucide-react";
import type { AirCity, WeatherCity } from "@/types/api";
import type { City } from "@/config/cities";

// ── Palette ───────────────────────────────────────────────────────────────────
const CAT: Record<string, {
  sky1: string; sky2: string; sky3: string; glow: string;
  accent: string; accentRGB: [number,number,number];
  label: string; tagBg: string;
}> = {
  BAIK: {
    sky1:"#0a1f0f", sky2:"#14532d", sky3:"#16a34a",
    glow:"rgba(74,222,128,0.35)", accent:"#22c55e", accentRGB:[34,197,94],
    label:"BAIK", tagBg:"#dcfce7",
  },
  SEDANG: {
    sky1:"#050e2e", sky2:"#1e3a5f", sky3:"#3b82f6",
    glow:"rgba(96,165,250,0.35)", accent:"#60a5fa", accentRGB:[96,165,250],
    label:"SEDANG", tagBg:"#dbeafe",
  },
  TIDAK_SEHAT: {
    sky1:"#1c0f00", sky2:"#78350f", sky3:"#f59e0b",
    glow:"rgba(251,146,60,0.4)", accent:"#f97316", accentRGB:[249,115,22],
    label:"TIDAK SEHAT", tagBg:"#ffedd5",
  },
  SANGAT_TIDAK_SEHAT: {
    sky1:"#1a0000", sky2:"#7f1d1d", sky3:"#ef4444",
    glow:"rgba(248,113,113,0.4)", accent:"#f87171", accentRGB:[248,113,113],
    label:"SGT TDK SEHAT", tagBg:"#fee2e2",
  },
  BERBAHAYA: {
    sky1:"#050505", sky2:"#1a0505", sky3:"#7f1d1d",
    glow:"rgba(239,68,68,0.3)", accent:"#ef4444", accentRGB:[239,68,68],
    label:"BERBAHAYA", tagBg:"#fecaca",
  },
};
const FALLBACK = CAT.SEDANG;

const SCHOOL_SHORT: Record<string, string> = {
  NORMAL:"Normal ✓", WASPADA:"Waspada ⚠", HYBRID:"Hybrid 🏠", DARING_DARURAT:"Darurat 🚨",
};

// ── Canvas size ───────────────────────────────────────────────────────────────
const CW = 1080;
const CH = 1920;

// ── Rounded rect ─────────────────────────────────────────────────────────────
function rr(c: CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number) {
  c.beginPath(); c.roundRect(x,y,w,h,r); c.closePath();
}

// ── Draw one static flame ─────────────────────────────────────────────────────
function drawFlame(c:CanvasRenderingContext2D, cx:number, by:number, scale:number, t:number) {
  const fw = 36*scale, fh = 72*scale;
  const wob = Math.sin(t*2.5)*6*scale;
  // outer
  c.save(); c.beginPath();
  c.moveTo(cx, by);
  c.bezierCurveTo(cx-fw*.6,by-fh*.4,cx-fw*.3+wob,by-fh*.75,cx,by-fh);
  c.bezierCurveTo(cx+fw*.3-wob,by-fh*.75,cx+fw*.6,by-fh*.4,cx,by);
  const go=c.createRadialGradient(cx,by-fh*.3,2,cx,by,fw*.8);
  go.addColorStop(0,"rgba(255,80,0,.95)");
  go.addColorStop(.5,"rgba(255,140,0,.85)");
  go.addColorStop(1,"rgba(255,60,0,.3)");
  c.fillStyle=go; c.fill(); c.restore();
  // inner
  c.save(); c.beginPath();
  const wob2=Math.sin(t*3+1)*4*scale;
  c.moveTo(cx,by-4*scale);
  c.bezierCurveTo(cx-fw*.35,by-fh*.45,cx-fw*.15+wob2,by-fh*.72,cx,by-fh*.85);
  c.bezierCurveTo(cx+fw*.15-wob2,by-fh*.72,cx+fw*.35,by-fh*.45,cx,by-4*scale);
  const gi=c.createRadialGradient(cx,by-fh*.5,1,cx,by-fh*.2,fw*.5);
  gi.addColorStop(0,"rgba(255,255,120,.95)");
  gi.addColorStop(.6,"rgba(255,200,0,.8)");
  gi.addColorStop(1,"rgba(255,120,0,.2)");
  c.fillStyle=gi; c.fill(); c.restore();
}

// ── Draw masked character (hand-drawn SVG style via canvas paths) ─────────────
function drawCharacter(c: CanvasRenderingContext2D, cx: number, cy: number, cat: string, scale = 1) {
  const s = scale;
  // Body colour per mood
  const skinTone = "#f5c5a3";
  const shirtColor = {
    BAIK:"#22c55e", SEDANG:"#60a5fa", TIDAK_SEHAT:"#f97316",
    SANGAT_TIDAK_SEHAT:"#ef4444", BERBAHAYA:"#475569",
  }[cat] ?? "#60a5fa";

  const headR = 52*s;
  const bodyW = 90*s;
  const bodyH = 100*s;
  const headCY = cy - bodyH/2 - headR - 4*s;

  // ── Shadow under feet ──
  c.save();
  c.fillStyle = "rgba(0,0,0,0.15)";
  c.beginPath();
  c.ellipse(cx, cy+10*s, 55*s, 12*s, 0, 0, Math.PI*2);
  c.fill();
  c.restore();

  // ── Body (shirt) ──
  c.save();
  c.fillStyle = shirtColor;
  c.beginPath();
  c.moveTo(cx - bodyW/2, cy);
  c.quadraticCurveTo(cx - bodyW/2 - 8*s, cy - bodyH/2, cx - bodyW/2 + 10*s, cy - bodyH);
  c.lineTo(cx + bodyW/2 - 10*s, cy - bodyH);
  c.quadraticCurveTo(cx + bodyW/2 + 8*s, cy - bodyH/2, cx + bodyW/2, cy);
  c.closePath();
  c.fill();
  c.restore();

  // ── Arms ──
  const armPose: Record<string, [number,number,number,number,number,number][]> = {
    BAIK: [[-50,-40,-80,-10,-70,20],[ 50,-40, 80,-10, 70,20]],            // both arms slightly raised
    SEDANG: [[-50,-30,-75,-20,-65,10],[50,-30, 75,-20, 65,10]],
    TIDAK_SEHAT: [[-50,-20,-70,10,-55,30],[50,-20, 70,10, 55,30]],        // arms down, worried
    SANGAT_TIDAK_SEHAT: [[-50,-40,-85,-60,-70,-30],[50,-40, 85,-60, 70,-30]], // hands up panic
    BERBAHAYA: [[-50,-30,-80,-50,-65,-20],[50,-30, 80,-50, 65,-20]],
  };
  const poses = armPose[cat] ?? armPose.SEDANG;
  poses.forEach(([dx1,dy1,dx2,dy2,dx3,dy3]) => {
    c.save();
    c.strokeStyle = shirtColor;
    c.lineWidth = 22*s;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(cx+dx1*s, cy-bodyH*0.6+dy1*s);
    c.quadraticCurveTo(cx+dx2*s, cy-bodyH*0.4+dy2*s, cx+dx3*s, cy-bodyH*0.2+dy3*s);
    c.stroke();
    // Hand circle
    c.fillStyle = skinTone;
    c.beginPath();
    c.arc(cx+dx3*s, cy-bodyH*0.2+dy3*s, 14*s, 0, Math.PI*2);
    c.fill();
    c.restore();
  });

  // ── Legs ──
  c.save();
  c.strokeStyle = "#1e293b";
  c.lineWidth = 20*s;
  c.lineCap = "round";
  [-28*s, 28*s].forEach(ox => {
    c.beginPath();
    c.moveTo(cx+ox, cy);
    c.lineTo(cx+ox, cy+55*s);
    c.stroke();
    // Shoe
    c.fillStyle = "#334155";
    c.beginPath();
    c.ellipse(cx+ox+(ox>0?8:-8)*s, cy+60*s, 20*s, 10*s, ox>0?0.2:-0.2, 0, Math.PI*2);
    c.fill();
  });
  c.restore();

  // ── Head ──
  c.save();
  c.fillStyle = skinTone;
  c.beginPath();
  c.arc(cx, headCY, headR, 0, Math.PI*2);
  c.fill();

  // Hair
  c.fillStyle = "#1e293b";
  c.beginPath();
  c.arc(cx, headCY - 8*s, headR*1.02, Math.PI*1.15, Math.PI*1.85, false);
  c.fill();

  // Eyes — expression per category
  const eyeY = headCY - 8*s;
  const eyeOff = 20*s;
  if (cat === "BERBAHAYA" || cat === "SANGAT_TIDAK_SEHAT") {
    // Worried arched brows + squint
    [-eyeOff, eyeOff].forEach((ox, i) => {
      c.fillStyle = "#1e293b";
      c.beginPath();
      c.ellipse(cx+ox, eyeY, 9*s, 5*s, i===0?0.3:-0.3, 0, Math.PI*2);
      c.fill();
      // Brow
      c.strokeStyle = "#1e293b";
      c.lineWidth = 4*s;
      c.beginPath();
      c.moveTo(cx+ox-12*s, eyeY-16*s+(i===0?-5:5)*s);
      c.lineTo(cx+ox+12*s, eyeY-16*s+(i===0?5:-5)*s);
      c.stroke();
    });
  } else if (cat === "BAIK") {
    // Happy closed eyes (arcs)
    [-eyeOff, eyeOff].forEach(ox => {
      c.strokeStyle = "#1e293b";
      c.lineWidth = 4*s;
      c.beginPath();
      c.arc(cx+ox, eyeY+2*s, 10*s, Math.PI*1.1, Math.PI*1.9);
      c.stroke();
    });
  } else {
    // Normal eyes
    [-eyeOff, eyeOff].forEach(ox => {
      c.fillStyle = "#1e293b";
      c.beginPath();
      c.arc(cx+ox, eyeY, 10*s, 0, Math.PI*2);
      c.fill();
      c.fillStyle = "white";
      c.beginPath();
      c.arc(cx+ox+2*s, eyeY-2*s, 3*s, 0, Math.PI*2);
      c.fill();
    });
  }
  c.restore();

  // ── N95 mask ──
  c.save();
  const maskY = headCY + 12*s;
  const maskW = headR*1.5;
  const maskH = headR*0.7;
  // Mask body
  c.fillStyle = cat === "BAIK" ? "#dcfce7" : cat === "SEDANG" ? "#dbeafe" : "#e2e8f0";
  c.strokeStyle = cat === "BAIK" ? "#22c55e" : cat === "SEDANG" ? "#60a5fa" : "#94a3b8";
  c.lineWidth = 3*s;
  rr(c, cx-maskW/2, maskY-maskH/2, maskW, maskH, 14*s);
  c.fill(); c.stroke();
  // Mask straps
  c.strokeStyle = "#94a3b8";
  c.lineWidth = 3*s;
  [[-1,1],[1,1]].forEach(([sx]) => {
    c.beginPath();
    c.moveTo(cx+sx*maskW/2, maskY - 6*s);
    c.quadraticCurveTo(cx+sx*(headR+12*s), maskY-20*s, cx+sx*(headR-2*s), headCY-10*s);
    c.stroke();
  });
  // N95 label
  c.fillStyle = "#64748b";
  c.font = `bold ${12*s}px sans-serif`;
  c.textAlign = "center";
  c.fillText("N95", cx, maskY + 5*s);
  c.restore();
}

// ── Draw full card (static, for PNG export) ───────────────────────────────────
function drawCard(
  canvas: HTMLCanvasElement,
  city: City,
  air: AirCity,
  weather: WeatherCity | undefined,
  t = 0, // time for flame wobble (static = 0)
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = CW;
  canvas.height = CH;

  const cat = air.ispuNow?.category ?? "SEDANG";
  const pal = CAT[cat] ?? FALLBACK;
  const ispu = air.ispuNow?.value ?? 0;
  const pm25 = air.pm25 ?? 0;
  const ispu24 = air.ispu24h?.value ?? null;
  const temp = weather?.temp != null ? `${Math.round(weather.temp)}°C` : "—";
  const wind = weather?.windKmh != null ? `${Math.round(weather.windKmh)} km/j` : "—";
  const rh   = weather?.rh    != null ? `${Math.round(weather.rh)}%`  : "—";
  const school = SCHOOL_SHORT[air.status.code] ?? air.status.label;
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: city.tz, weekday:"long", day:"numeric", month:"long", year:"numeric",
  }).format(now);
  const timeStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: city.tz, hour:"2-digit", minute:"2-digit", hour12:false,
  }).format(now) + " " + city.tzLabel;

  // ── 1. Full fire-sky background ──
  const sky = ctx.createLinearGradient(0, 0, 0, CH);
  sky.addColorStop(0, pal.sky1);
  sky.addColorStop(0.4, pal.sky2);
  sky.addColorStop(0.72, pal.sky3);
  sky.addColorStop(0.88, "#fbbf24");
  sky.addColorStop(1, "#fef3c7");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CW, CH);

  // ── 2. Radial glow in sky ──
  const glow = ctx.createRadialGradient(CW/2, CH*0.45, 80, CW/2, CH*0.45, 600);
  glow.addColorStop(0, pal.glow);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CW, CH*0.9);

  // ── 3. Static embers (dots) ──
  for (let i = 0; i < 60; i++) {
    const ex = (i * 137.5) % CW;
    const ey = ((i * 97 + 200) % (CH * 0.6)) + CH*0.05;
    const er = 2 + (i % 5);
    ctx.save();
    ctx.globalAlpha = 0.4 + (i%3)*0.15;
    ctx.fillStyle = i%2===0 ? "#fbbf24" : "#f97316";
    ctx.beginPath();
    ctx.arc(ex, ey, er, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // ── 4. Ground ──
  const groundY = CH * 0.82;
  const ground = ctx.createLinearGradient(0, groundY, 0, CH);
  ground.addColorStop(0, "#92400e");
  ground.addColorStop(0.5, "#78350f");
  ground.addColorStop(1, "#fbbf24");
  ctx.fillStyle = ground;
  ctx.fillRect(0, groundY, CW, CH - groundY);

  // ── 5. Flames along ground ──
  const flamePositions = [0.08,0.2,0.33,0.47,0.60,0.73,0.86,0.95];
  flamePositions.forEach((fx, i) => {
    drawFlame(ctx, fx*CW, groundY, 1.2 + (i%3)*0.3, t + i*0.5);
  });

  // ── 6. Frosted glass card ──
  const cardX = 60, cardY = CH*0.38, cardW = CW-120, cardH = CH*0.52;
  // Card shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 80;
  ctx.shadowOffsetY = 20;
  rr(ctx, cardX, cardY, cardW, cardH, 56);
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fill();
  ctx.restore();

  // Card top accent strip
  rr(ctx, cardX, cardY, cardW, 16, 8);
  ctx.fillStyle = pal.accent;
  ctx.fill();

  // ── 7. Character on card ──
  const charX = CW*0.78;
  const charY = cardY + 20;
  drawCharacter(ctx, charX, charY, cat, 1.15);

  // ── 8. Top bar ──
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  rr(ctx, 60, 64, 340, 76, 38);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("🔥  PyroAlert '26", 90, 113);
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "28px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.fillText(timeStr, CW-60, 113);

  // ── 9. City + province ──
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "36px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.fillText(city.province.toUpperCase(), CW/2-80, 240);
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${city.name.length>11?72:88}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
  ctx.fillText(city.name, CW/2-80, 360);

  // ── 10. ISPU big number ──
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${ispu>=300?280:320}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(String(ispu), 80, 720);

  // ISPU category badge
  const [ar,ag,ab] = pal.accentRGB;
  rr(ctx, 80, 750, 340, 72, 36);
  ctx.fillStyle = `rgba(${ar},${ag},${ab},0.25)`;
  ctx.fill();
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = pal.accent;
  ctx.font = "bold 38px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(pal.label, 80+170, 797);

  // Description
  const descMap: Record<string,string> = {
    BAIK:"Udara Sehat — Aman Beraktivitas",
    SEDANG:"Bisa Keluar, Tetap Waspada",
    TIDAK_SEHAT:"Kurangi Aktivitas di Luar",
    SANGAT_TIDAK_SEHAT:"Hindari Keluar Rumah",
    BERBAHAYA:"Tetap di Dalam Rumah",
  };
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "34px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.fillText(descMap[cat]??"", CW/2-80, 880);

  // ── 11. Card inner content ──
  const cX = cardX + cardW/2;
  const cInY = cardY + 80;

  // Title on card
  ctx.textAlign = "center";
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 40px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.fillText("Laporan Kualitas Udara", cX - cardW*0.12, cInY + 60);

  // Divider
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX+60, cInY+95);
  ctx.lineTo(cardX+cardW*0.6, cInY+95);
  ctx.stroke();

  // Stats grid 3×2
  const stats = [
    {label:"PM2.5",     val:`${pm25.toFixed(1)} µg`},
    {label:"ISPU 24j",  val: ispu24!=null?String(ispu24):"—"},
    {label:"Suhu",      val: temp},
    {label:"Angin",     val: wind},
    {label:"Kelembapan",val: rh},
    {label:"Sekolah",   val: school},
  ];
  const gCols=3, gStartX=cardX+36, gStartY=cInY+115;
  const gCellW=(cardW*0.65)/gCols, gCellH=160;
  stats.forEach((s,i) => {
    const col=i%gCols, row=Math.floor(i/gCols);
    const cx2=gStartX+col*gCellW+gCellW/2;
    const cy2=gStartY+row*gCellH;
    rr(ctx, gStartX+col*gCellW+6, cy2+6, gCellW-12, gCellH-16, 20);
    ctx.fillStyle = col===0?`rgba(${ar},${ag},${ab},0.06)`:"#f8fafc";
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "22px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.label.toUpperCase(), cx2, cy2+44);
    ctx.fillStyle = i===5?pal.accent:"#0f172a";
    ctx.font = `bold ${s.val.length>7?30:38}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
    ctx.fillText(s.val, cx2, cy2+100);
  });

  // Date
  const dY = cardY+cardH-260;
  rr(ctx, cardX+48, dY, cardW-96, 66, 16);
  ctx.fillStyle = "#f1f5f9";
  ctx.fill();
  ctx.fillStyle = "#64748b";
  ctx.font = "26px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("📅  "+dateStr, cX, dY+43);

  // URL
  rr(ctx, cardX+48, dY+82, cardW-96, 56, 14);
  ctx.fillStyle = "#f8fafc";
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.font = "22px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.fillText("eduair.vercel.app/udara?kota="+city.id, cX, dY+117);

  // Card footer
  const fY = cardY+cardH-140;
  ctx.strokeStyle = "#f1f5f9"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(cardX+60,fY); ctx.lineTo(cardX+cardW-60,fY); ctx.stroke();
  ctx.fillStyle = pal.accent;
  ctx.font = "bold 26px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.fillText("PyroAlert Karhutla '26", cX, fY+40);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "22px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.fillText("by Muhammad Salman Al Farisi · @avlfarizii", cX, fY+72);

  // Bottom disclaimer
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "22px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  ctx.fillText("Data estimasi CAMS · Bukan alat ukur resmi BMKG", CW/2, CH-56);
}

// ── Animated preview canvas ───────────────────────────────────────────────────
interface PreviewProps {
  city: City; air: AirCity; weather: WeatherCity | undefined;
  onReady: (canvas: HTMLCanvasElement) => void;
}
function AnimatedPreview({ city, air, weather, onReady }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Embers state
  type Ember = {x:number;y:number;vx:number;vy:number;r:number;a:number;color:string};
  const embersRef = useRef<Ember[]>([]);

  const spawnEmber = useCallback((W:number, H:number) => {
    const x = Math.random()*W;
    const y = H*0.85;
    embersRef.current.push({
      x, y,
      vx:(Math.random()-.5)*1.2,
      vy:-(1.5+Math.random()*2.5),
      r:2+Math.random()*3,
      a:0.8+Math.random()*0.2,
      color:Math.random()>.5?"#fbbf24":"#f97316",
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size the preview
    const PW = 270, PH = 480;
    canvas.width = PW; canvas.height = PH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      tRef.current += 0.04;
      const t = tRef.current;

      // Spawn embers
      if (Math.random() < 0.35) spawnEmber(PW, PH);

      // Draw scaled card
      const offscreen = document.createElement("canvas");
      drawCard(offscreen, city, air, weather, t);
      ctx.drawImage(offscreen, 0, 0, PW, PH);

      // Draw embers on top
      embersRef.current = embersRef.current.filter(e => e.a > 0.05);
      embersRef.current.forEach(e => {
        e.x += e.vx; e.y += e.vy; e.a -= 0.015; e.r *= 0.995;
        ctx.save();
        ctx.globalAlpha = e.a;
        ctx.fillStyle = e.color;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Notify parent of the offscreen full-res canvas for export
    const full = document.createElement("canvas");
    drawCard(full, city, air, weather);
    onReady(full);

    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas ref={canvasRef} width={270} height={480}
      className="block rounded-3xl shadow-2xl border border-white/10"
      style={{ width:270, height:480 }} />
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  city: City; air: AirCity; weather: WeatherCity|undefined; onClose:()=>void;
}
function ShareModal({ city, air, weather, onClose }: ModalProps) {
  const fullCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<"idle"|"working"|"done">("idle");

  const getBlob = useCallback((): Promise<Blob> => new Promise((res,rej) => {
    const c = fullCanvasRef.current;
    if (!c) { rej(new Error("no canvas")); return; }
    c.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), "image/png");
  }), []);

  const download = useCallback(async () => {
    setStatus("working");
    try {
      const blob = await getBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href=url; a.download=`pyroalert-${city.id}.png`; a.click();
      URL.revokeObjectURL(url);
      setStatus("done");
    } catch { setStatus("idle"); }
    setTimeout(()=>setStatus("idle"), 2500);
  }, [city.id, getBlob]);

  const shareImage = useCallback(async () => {
    setStatus("working");
    try {
      const blob = await getBlob();
      const file = new File([blob],`pyroalert-${city.id}.png`,{type:"image/png"});
      if (navigator.canShare?.({files:[file]})) {
        await navigator.share({
          title:`Udara ${city.name} — PyroAlert`,
          text:`ISPU ${air.ispuNow?.value??""} (${air.ispuNow?.label??""}) di ${city.name}`,
          files:[file],
        });
        setStatus("done");
      } else { await download(); return; }
    } catch { /* cancelled */ }
    setTimeout(()=>setStatus("idle"), 2500);
  }, [air.ispuNow, city, download, getBlob]);

  const shareWA = useCallback(async () => {
    setStatus("working");
    try {
      const blob = await getBlob();
      const file = new File([blob],`pyroalert-${city.id}.png`,{type:"image/png"});
      if (navigator.canShare?.({files:[file]})) {
        await navigator.share({files:[file],title:`Udara ${city.name}`});
        setStatus("done");
        setTimeout(()=>setStatus("idle"),2500);
        return;
      }
    } catch { /* fall through */ }
    const txt=`🔥 *Udara ${city.name}* ISPU *${air.ispuNow?.value??""} — ${air.ispuNow?.label??""}*\n\n📡 https://eduair.vercel.app/udara?kota=${city.id}\nvia @avlfarizii`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`,"_blank","noopener");
    setStatus("idle");
  }, [air.ispuNow, city, getBlob]);

  const cat = air.ispuNow?.category ?? "SEDANG";
  const pal = CAT[cat] ?? FALLBACK;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}/>
      <div className="relative z-10 w-full sm:max-w-[390px] bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[96dvh] flex flex-col">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200"/>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:pal.accent}}>
              Bagikan sebagai gambar 9:16
            </p>
            <p className="text-slate-900 font-black text-lg leading-tight">{city.name}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700">
            <X size={15}/>
          </button>
        </div>

        {/* Animated preview */}
        <div className="flex-1 overflow-y-auto px-5 pb-2 min-h-0 flex flex-col items-center gap-2">
          <AnimatedPreview city={city} air={air} weather={weather}
            onReady={c => { fullCanvasRef.current = c; }} />
          <p className="text-[10px] text-slate-400 text-center">
            Animasi live preview · PNG diam saat diunduh
          </p>
        </div>

        {/* Buttons */}
        <div className="flex-shrink-0 px-5 pb-6 pt-3 flex flex-col gap-2.5 border-t border-slate-100">
          <button onClick={shareImage} disabled={status==="working"}
            className="flex items-center justify-center gap-2.5 w-full rounded-2xl py-4 font-black text-sm text-white disabled:opacity-50 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{background:`linear-gradient(90deg,${pal.sky2},${pal.accent})`}}>
            <Share2 size={17}/>
            {status==="working"?"Memproses…":status==="done"?"Berhasil! ✓":"Bagikan Gambar (IG Story / lainnya)"}
          </button>
          <button onClick={shareWA} disabled={status==="working"}
            className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1db954] text-white rounded-2xl py-3.5 font-bold text-sm disabled:opacity-50 transition-all hover:opacity-90 active:scale-[0.98]">
            <MessageCircle size={17}/>
            Bagikan via WhatsApp
          </button>
          <button onClick={download} disabled={status==="working"}
            className="flex items-center justify-center gap-2.5 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl py-3.5 font-bold text-sm disabled:opacity-50 transition-all active:scale-[0.98]">
            <Download size={17}/>
            Unduh PNG ke galeri
          </button>
          <p className="text-center text-[10px] text-slate-400 leading-relaxed px-2">
            💡 Unduh → buka galeri → share ke Instagram Story / WhatsApp Status
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ── Trigger button ────────────────────────────────────────────────────────────
interface ShareCardProps {
  city: City; air: AirCity|undefined; weather: WeatherCity|undefined;
}
export function ShareCard({ city, air, weather }: ShareCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(()=>setMounted(true),[]);

  if (!air?.ispuNow) return null;
  const cat = air.ispuNow.category;
  const pal = CAT[cat] ?? FALLBACK;

  return (
    <>
      <button onClick={()=>setOpen(true)}
        className="w-full flex items-center justify-between rounded-3xl bg-white border border-slate-200 hover:border-slate-300 px-5 py-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-px group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
            style={{background:`${pal.accent}15`, border:`1.5px solid ${pal.accent}35`}}>
            <Share2 size={17} style={{color:pal.accent}}/>
          </div>
          <div className="text-left">
            <p className="font-black text-sm text-slate-800 leading-tight">Bagikan sebagai Gambar</p>
            <p className="text-xs text-slate-400">IG Story · WA Status · Download PNG</p>
          </div>
        </div>
        <div className="rounded-xl px-3 py-2 text-center flex-shrink-0"
          style={{background:`${pal.accent}10`, border:`1.5px solid ${pal.accent}25`}}>
          <p className="font-black text-lg tabular-nums leading-tight" style={{color:pal.accent}}>
            {air.ispuNow.value}
          </p>
          <p className="text-[10px] text-slate-400">ISPU</p>
        </div>
      </button>
      {mounted && open && air && (
        <ShareModal city={city} air={air} weather={weather} onClose={()=>setOpen(false)}/>
      )}
    </>
  );
}
