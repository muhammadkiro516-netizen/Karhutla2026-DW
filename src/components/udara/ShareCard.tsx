"use client";
/**
 * ShareCard — premium "game card" style 1080×1920 PNG share image.
 * 
 * Design language: holographic game card. Dark vignette edges, bold
 * accent colour stripe, oversized typography, N95 character illustration
 * with per-condition expression, ember particle animation in preview.
 * White palette base with single saturated accent — clean, not noisy.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, X, MessageCircle } from "lucide-react";
import type { AirCity, WeatherCity } from "@/types/api";
import type { City } from "@/config/cities";

// ── Per-category visual theme ─────────────────────────────────────────────────
const THEME: Record<string, {
  bg: string; stripe: string; accent: string; accentDark: string;
  rgb: [number,number,number]; label: string; emoji: string;
}> = {
  BAIK:               { bg:"#f0fdf4", stripe:"#16a34a", accent:"#22c55e", accentDark:"#14532d", rgb:[34,197,94],  label:"BAIK",             emoji:"🌿" },
  SEDANG:             { bg:"#eff6ff", stripe:"#2563eb", accent:"#3b82f6", accentDark:"#1e3a5f", rgb:[59,130,246], label:"SEDANG",           emoji:"💨" },
  TIDAK_SEHAT:        { bg:"#fffbeb", stripe:"#d97706", accent:"#f59e0b", accentDark:"#78350f", rgb:[245,158,11], label:"TIDAK SEHAT",      emoji:"😷" },
  SANGAT_TIDAK_SEHAT: { bg:"#fef2f2", stripe:"#dc2626", accent:"#ef4444", accentDark:"#7f1d1d", rgb:[239,68,68],  label:"SGT TDK SEHAT",    emoji:"⚠️" },
  BERBAHAYA:          { bg:"#fafafa", stripe:"#0f172a", accent:"#475569", accentDark:"#020617", rgb:[71,85,105],  label:"BERBAHAYA",        emoji:"☠️" },
};
const DEFAULT_THEME = THEME.SEDANG;

const SCHOOL_S: Record<string,string> = {
  NORMAL:"Normal ✓", WASPADA:"Waspada ⚠", HYBRID:"Hybrid 🏠", DARING_DARURAT:"Darurat 🚨",
};
const DESC: Record<string,string> = {
  BAIK:"Aman Beraktivitas di Luar", SEDANG:"Bisa Keluar, Tetap Waspada",
  TIDAK_SEHAT:"Kurangi Aktivitas di Luar", SANGAT_TIDAK_SEHAT:"Hindari Keluar Rumah",
  BERBAHAYA:"Tetap di Dalam Rumah",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const CW = 1080, CH = 1920;
function rr(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  c.beginPath();c.roundRect(x,y,w,h,r);c.closePath();
}
function hex2rgb(hex:string):[number,number,number]{
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

// ── Character illustration ────────────────────────────────────────────────────
function drawMaskChar(c:CanvasRenderingContext2D, cx:number, cy:number, cat:string, s=1){
  // Per-category shirt colours
  const shirt = {BAIK:"#22c55e",SEDANG:"#3b82f6",TIDAK_SEHAT:"#f59e0b",
    SANGAT_TIDAK_SEHAT:"#ef4444",BERBAHAYA:"#64748b"}[cat]??"#3b82f6";
  const skin="#f5c9a0", hair="#1e293b";
  const bH=110*s, bW=96*s;
  const hR=54*s;
  const footY=cy;
  const bodyTop=footY-bH;
  const headCY=bodyTop-hR-6*s;

  // Shadow
  c.save(); c.globalAlpha=0.12;
  c.fillStyle="#000";c.beginPath();
  c.ellipse(cx,footY+8*s,58*s,13*s,0,0,Math.PI*2);c.fill();
  c.restore();

  // Legs
  c.save();c.strokeStyle="#1e293b";c.lineWidth=22*s;c.lineCap="round";
  [-30*s,30*s].forEach(ox=>{
    c.beginPath();c.moveTo(cx+ox,footY-10*s);c.lineTo(cx+ox,footY+48*s);c.stroke();
    c.fillStyle="#334155";c.beginPath();
    c.ellipse(cx+ox+(ox>0?10:-10)*s,footY+52*s,20*s,10*s,ox>0?.2:-.2,0,Math.PI*2);c.fill();
  });c.restore();

  // Body
  c.save();c.fillStyle=shirt;c.beginPath();
  c.moveTo(cx-bW/2,footY);
  c.quadraticCurveTo(cx-bW/2-10*s,bodyTop+bH*.4,cx-bW/2+12*s,bodyTop);
  c.lineTo(cx+bW/2-12*s,bodyTop);
  c.quadraticCurveTo(cx+bW/2+10*s,bodyTop+bH*.4,cx+bW/2,footY);
  c.closePath();c.fill();c.restore();

  // Collar
  c.save();c.fillStyle="#f8fafc";c.beginPath();
  c.moveTo(cx-18*s,bodyTop+4*s);c.lineTo(cx,bodyTop+28*s);c.lineTo(cx+18*s,bodyTop+4*s);
  c.closePath();c.fill();c.restore();

  // Arms per mood
  const arms:{x1:number,y1:number,x2:number,y2:number,x3:number,y3:number}[]=(()=>{
    const t=bodyTop+bH*.35;
    if(cat==="BAIK") return [
      {x1:-bW/2,y1:t,x2:-bW/2-30*s,y2:t-40*s,x3:-bW/2-20*s,y3:t-80*s},
      {x1: bW/2,y1:t,x2: bW/2+30*s,y2:t-40*s,x3: bW/2+20*s,y3:t-80*s},
    ];
    if(cat==="SANGAT_TIDAK_SEHAT") return [
      {x1:-bW/2,y1:t,x2:-bW/2-40*s,y2:t-60*s,x3:-bW/2-30*s,y3:t-110*s},
      {x1: bW/2,y1:t,x2: bW/2+40*s,y2:t-60*s,x3: bW/2+30*s,y3:t-110*s},
    ];
    if(cat==="BERBAHAYA") return [
      {x1:-bW/2,y1:t,x2:-bW/2-35*s,y2:t-30*s,x3:-bW/2-45*s,y3:t+20*s},
      {x1: bW/2,y1:t,x2: bW/2+35*s,y2:t-30*s,x3: bW/2+45*s,y3:t+20*s},
    ];
    return [
      {x1:-bW/2,y1:t,x2:-bW/2-28*s,y2:t-20*s,x3:-bW/2-36*s,y3:t+20*s},
      {x1: bW/2,y1:t,x2: bW/2+28*s,y2:t-20*s,x3: bW/2+36*s,y3:t+20*s},
    ];
  })();
  arms.forEach(a=>{
    c.save();c.strokeStyle=shirt;c.lineWidth=20*s;c.lineCap="round";
    c.beginPath();c.moveTo(cx+a.x1,a.y1);
    c.quadraticCurveTo(cx+a.x2,a.y2,cx+a.x3,a.y3);c.stroke();
    c.fillStyle=skin;c.beginPath();c.arc(cx+a.x3,a.y3,13*s,0,Math.PI*2);c.fill();
    c.restore();
  });

  // Head
  c.save();c.fillStyle=skin;c.beginPath();
  c.arc(cx,headCY,hR,0,Math.PI*2);c.fill();
  // Hair
  c.fillStyle=hair;c.beginPath();
  c.arc(cx,headCY-10*s,hR*1.02,Math.PI*1.1,Math.PI*1.9,false);c.fill();
  // Ears
  [-1,1].forEach(side=>{
    c.fillStyle=skin;c.beginPath();
    c.ellipse(cx+side*hR*.95,headCY,9*s,13*s,0,0,Math.PI*2);c.fill();
  });

  // Eyes per mood
  const eyeY=headCY-10*s;
  const eyeX=22*s;
  if(cat==="BAIK"){
    // Happy arc eyes
    c.strokeStyle=hair;c.lineWidth=4*s;
    [-eyeX,eyeX].forEach(ox=>{
      c.beginPath();c.arc(cx+ox,eyeY+4*s,10*s,Math.PI*1.15,Math.PI*1.85);c.stroke();
    });
  } else if(cat==="BERBAHAYA"||cat==="SANGAT_TIDAK_SEHAT"){
    // Worried eyes — slanted
    [-eyeX,eyeX].forEach((ox,i)=>{
      c.fillStyle=hair;c.beginPath();
      c.ellipse(cx+ox,eyeY,9*s,7*s,i===0?.3:-.3,0,Math.PI*2);c.fill();
      c.fillStyle="#fff";c.beginPath();c.arc(cx+ox+2*s,eyeY-1*s,2.5*s,0,Math.PI*2);c.fill();
      // brow
      c.strokeStyle=hair;c.lineWidth=4*s;c.lineCap="round";
      c.beginPath();
      c.moveTo(cx+ox-12*s,eyeY-18*s+(i===0?-6:6)*s);
      c.lineTo(cx+ox+12*s,eyeY-18*s+(i===0?6:-6)*s);c.stroke();
    });
  } else {
    // Normal
    [-eyeX,eyeX].forEach(ox=>{
      c.fillStyle=hair;c.beginPath();c.arc(cx+ox,eyeY,10*s,0,Math.PI*2);c.fill();
      c.fillStyle="#fff";c.beginPath();c.arc(cx+ox+2.5*s,eyeY-2.5*s,3*s,0,Math.PI*2);c.fill();
    });
  }
  c.restore();

  // N95 mask
  c.save();
  const mY=headCY+18*s, mW=hR*1.6, mH=hR*.72;
  const mCol=cat==="BAIK"?"#bbf7d0":cat==="SEDANG"?"#bfdbfe":cat==="TIDAK_SEHAT"?"#fde68a":"#fecaca";
  const mStroke=cat==="BAIK"?"#16a34a":cat==="SEDANG"?"#2563eb":cat==="TIDAK_SEHAT"?"#d97706":"#dc2626";
  rr(c,cx-mW/2,mY-mH/2,mW,mH,16*s);
  c.fillStyle=mCol;c.fill();
  c.strokeStyle=mStroke;c.lineWidth=3*s;c.stroke();
  // Mask ridge lines
  c.strokeStyle=mStroke+"88";c.lineWidth=2*s;
  for(let i=1;i<=2;i++){
    c.beginPath();
    c.moveTo(cx-mW*.38,mY-mH/2+i*mH/3);
    c.lineTo(cx+mW*.38,mY-mH/2+i*mH/3);c.stroke();
  }
  // N95 label
  c.fillStyle=mStroke;c.font=`bold ${13*s}px sans-serif`;
  c.textAlign="center";c.fillText("N95",cx,mY+5*s);
  // Ear straps
  c.strokeStyle="#94a3b8";c.lineWidth=3*s;c.lineCap="round";
  [[-1,1],[1,1]].forEach(([sx])=>{
    c.beginPath();
    c.moveTo(cx+sx*mW*.48,mY-8*s);
    c.quadraticCurveTo(cx+sx*(hR+16*s),mY-22*s,cx+sx*(hR-2*s),headCY-16*s);c.stroke();
  });
  c.restore();
}

// ── Fire flame ────────────────────────────────────────────────────────────────
function flame(c:CanvasRenderingContext2D,cx:number,by:number,sc:number,t:number){
  const fw=30*sc,fh=58*sc;
  const w=Math.sin(t*2.8)*5*sc;
  c.save();c.beginPath();
  c.moveTo(cx,by);
  c.bezierCurveTo(cx-fw*.6,by-fh*.4,cx-fw*.3+w,by-fh*.76,cx,by-fh);
  c.bezierCurveTo(cx+fw*.3-w,by-fh*.76,cx+fw*.6,by-fh*.4,cx,by);
  const g=c.createRadialGradient(cx,by-fh*.3,2,cx,by,fw*.9);
  g.addColorStop(0,"rgba(255,100,0,.9)");g.addColorStop(.5,"rgba(255,160,0,.8)");g.addColorStop(1,"rgba(255,60,0,.2)");
  c.fillStyle=g;c.fill();c.restore();
  c.save();c.beginPath();
  const w2=Math.sin(t*3.2+1)*3*sc;
  c.moveTo(cx,by-6*sc);
  c.bezierCurveTo(cx-fw*.3,by-fh*.44,cx-fw*.12+w2,by-fh*.74,cx,by-fh*.88);
  c.bezierCurveTo(cx+fw*.12-w2,by-fh*.74,cx+fw*.3,by-fh*.44,cx,by-6*sc);
  const g2=c.createRadialGradient(cx,by-fh*.52,1,cx,by-fh*.2,fw*.4);
  g2.addColorStop(0,"rgba(255,255,140,.9)");g2.addColorStop(.5,"rgba(255,200,0,.7)");g2.addColorStop(1,"transparent");
  c.fillStyle=g2;c.fill();c.restore();
}

// ── Main card draw (static PNG) ───────────────────────────────────────────────
function drawCard(cv:HTMLCanvasElement,city:City,air:AirCity,weather:WeatherCity|undefined,t=0){
  const c=cv.getContext("2d");if(!c)return;
  cv.width=CW;cv.height=CH;

  const cat=air.ispuNow?.category??"SEDANG";
  const th=THEME[cat]??DEFAULT_THEME;
  const ispu=air.ispuNow?.value??0;
  const pm25=air.pm25??0;
  const i24=air.ispu24h?.value??null;
  const temp=weather?.temp!=null?`${Math.round(weather.temp)}°C`:"—";
  const wind=weather?.windKmh!=null?`${Math.round(weather.windKmh)} km/j`:"—";
  const rh=weather?.rh!=null?`${Math.round(weather.rh)}%`:"—";
  const school=SCHOOL_S[air.status.code]??air.status.label;
  const now=new Date();
  const dateStr=new Intl.DateTimeFormat("id-ID",{timeZone:city.tz,weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(now);
  const timeStr=new Intl.DateTimeFormat("id-ID",{timeZone:city.tz,hour:"2-digit",minute:"2-digit",hour12:false}).format(now)+" "+city.tzLabel;
  const [ar,ag,ab]=th.rgb;

  // ── 1. Clean white/tinted base ──
  c.fillStyle=th.bg;c.fillRect(0,0,CW,CH);

  // ── 2. Top hero zone: dark gradient ──
  const heroH=CH*0.56;
  const heroGrad=c.createLinearGradient(0,0,0,heroH+120);
  heroGrad.addColorStop(0,th.accentDark);
  heroGrad.addColorStop(0.55,`rgba(${ar},${ag},${ab},0.85)`);
  heroGrad.addColorStop(1,"transparent");
  c.fillStyle=heroGrad;c.fillRect(0,0,CW,heroH+120);

  // ── 3. Radial spotlight ──
  const spot=c.createRadialGradient(CW/2,heroH*.42,60,CW/2,heroH*.42,520);
  spot.addColorStop(0,`rgba(255,255,255,0.10)`);spot.addColorStop(1,"transparent");
  c.fillStyle=spot;c.fillRect(0,0,CW,heroH);

  // ── 4. Ground + flames ──
  const gY=heroH*0.84;
  const gGrad=c.createLinearGradient(0,gY,0,heroH);
  gGrad.addColorStop(0,`rgba(${ar},${ag},${ab},0.5)`);
  gGrad.addColorStop(0.5,"rgba(251,146,60,0.6)");
  gGrad.addColorStop(1,"rgba(254,215,170,0.9)");
  c.fillStyle=gGrad;c.fillRect(0,gY,CW,heroH-gY+60);

  [0.06,0.16,0.27,0.38,0.50,0.61,0.72,0.83,0.93].forEach((fx,i)=>
    flame(c,fx*CW,gY,0.9+Math.sin(i*.7)*.35,t+i*.5));

  // ── 5. Static embers ──
  for(let i=0;i<45;i++){
    const ex=(i*137.5)%CW,ey=((i*97+180)%(heroH*.72))+heroH*.04;
    c.save();c.globalAlpha=0.3+(i%4)*.12;
    c.fillStyle=i%2?"#fbbf24":"#f97316";
    c.beginPath();c.arc(ex,ey,1.5+(i%4),0,Math.PI*2);c.fill();c.restore();
  }

  // ── 6. Top bar ──
  c.fillStyle="rgba(255,255,255,0.14)";
  rr(c,56,60,370,72,36);c.fill();
  c.fillStyle="#fff";
  c.font="bold 30px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="left";c.fillText("🔥  PyroAlert '26",88,107);
  c.textAlign="right";c.fillStyle="rgba(255,255,255,0.55)";
  c.font="26px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText(timeStr,CW-56,107);

  // ── 7. City ──
  c.textAlign="center";
  c.fillStyle="rgba(255,255,255,0.5)";
  c.font="34px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText(city.province.toUpperCase(),CW/2-100,212);
  c.fillStyle="#fff";
  c.font=`bold ${city.name.length>12?68:84}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
  c.fillText(city.name,CW/2-100,320);

  // ── 8. Giant ISPU ──
  // Glow
  const numGlow=c.createRadialGradient(200,640,30,200,640,280);
  numGlow.addColorStop(0,`rgba(255,255,255,0.22)`);numGlow.addColorStop(1,"transparent");
  c.fillStyle=numGlow;c.fillRect(0,400,500,400);
  c.fillStyle="#ffffff";
  c.textAlign="left";
  c.font=`900 ${ispu>=300?290:330}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
  c.fillText(String(ispu),64,710);

  // ── 9. Category badge (pill) ──
  const badgeW=300,badgeH=64;
  rr(c,64,730,badgeW,badgeH,32);
  c.fillStyle=`rgba(255,255,255,0.18)`;c.fill();
  c.strokeStyle="rgba(255,255,255,0.40)";c.lineWidth=2;c.stroke();
  c.fillStyle="#fff";c.font="bold 34px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="center";c.fillText(`${th.emoji}  ${th.label}`,64+badgeW/2,773);

  // Description
  c.fillStyle="rgba(255,255,255,0.65)";
  c.font="32px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText(DESC[cat]??"",64+badgeW/2,838);

  // ── 10. Character (right side of hero) ──
  drawMaskChar(c,CW*0.78,gY-10,cat,1.1);

  // ── 11. White card ──
  const cdX=52,cdY=CH*0.575,cdW=CW-104,cdH=CH-cdY-80;
  c.save();c.shadowColor="rgba(0,0,0,0.12)";c.shadowBlur=60;c.shadowOffsetY=16;
  rr(c,cdX,cdY,cdW,cdH,52);c.fillStyle="#ffffff";c.fill();c.restore();
  // Card top accent stripe
  rr(c,cdX,cdY,cdW,14,7);c.fillStyle=th.accent;c.fill();

  const cCX=cdX+cdW/2;

  // Card title
  c.fillStyle="#0f172a";c.font="bold 38px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="center";c.fillText("📊  Laporan Kualitas Udara",cCX,cdY+82);
  // Divider
  c.strokeStyle="#f1f5f9";c.lineWidth=1.5;c.beginPath();
  c.moveTo(cdX+50,cdY+112);c.lineTo(cdX+cdW-50,cdY+112);c.stroke();

  // Stats 3×2 grid
  const stats=[
    {l:"PM2.5",v:`${pm25.toFixed(1)} µg`},
    {l:"ISPU 24j",v:i24!=null?String(i24):"—"},
    {l:"Suhu",v:temp},
    {l:"Angin",v:wind},
    {l:"Kelembapan",v:rh},
    {l:"Sekolah",v:school},
  ];
  const gW=(cdW-72)/3,gH=158,gSX=cdX+36,gSY=cdY+134;
  stats.forEach((s,i)=>{
    const col=i%3,row=Math.floor(i/3);
    const bx=gSX+col*gW+4,by=gSY+row*gH+4;
    rr(c,bx,by,gW-8,gH-12,20);
    c.fillStyle=col===0?`rgba(${ar},${ag},${ab},0.07)`:"#f8fafc";c.fill();
    const cx2=bx+(gW-8)/2;
    c.fillStyle="#94a3b8";c.font="22px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
    c.textAlign="center";c.fillText(s.l.toUpperCase(),cx2,by+42);
    c.fillStyle=i===5?th.accent:"#0f172a";
    c.font=`bold ${s.v.length>7?30:38}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
    c.fillText(s.v,cx2,by+100);
  });

  // Date strip
  const dY=gSY+2*gH+20;
  rr(c,cdX+44,dY,cdW-88,66,16);c.fillStyle="#f1f5f9";c.fill();
  c.fillStyle="#64748b";c.font="26px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="center";c.fillText("📅  "+dateStr,cCX,dY+42);

  // URL
  rr(c,cdX+44,dY+82,cdW-88,54,14);c.fillStyle="#f8fafc";c.fill();
  c.fillStyle="#94a3b8";c.font="22px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText("🔗 eduair.vercel.app/udara?kota="+city.id,cCX,dY+117);

  // Card footer
  const fY=dY+160;
  c.strokeStyle="#f1f5f9";c.lineWidth=1.5;c.beginPath();
  c.moveTo(cdX+60,fY);c.lineTo(cdX+cdW-60,fY);c.stroke();
  c.fillStyle=th.accent;
  c.font="bold 26px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText("PyroAlert Karhutla '26",cCX,fY+40);
  c.fillStyle="#94a3b8";c.font="22px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText("by Muhammad Salman Al Farisi · @avlfarizii",cCX,fY+70);

  // Bottom
  c.fillStyle="rgba(100,116,139,0.5)";
  c.font="20px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText("Data estimasi CAMS · Bukan alat ukur resmi BMKG",CW/2,CH-52);
}

// ── Animated preview ──────────────────────────────────────────────────────────
type Ember={x:number;y:number;vx:number;vy:number;r:number;a:number;c:string};

function AnimatedPreview({city,air,weather,onFull}:{
  city:City;air:AirCity;weather:WeatherCity|undefined;onFull:(cv:HTMLCanvasElement)=>void;
}){
  const cvRef=useRef<HTMLCanvasElement>(null);
  const tRef=useRef(0);
  const rafRef=useRef(0);
  const embersRef=useRef<Ember[]>([]);

  useEffect(()=>{
    const cv=cvRef.current;if(!cv)return;
    cv.width=270;cv.height=480;
    const ctx=cv.getContext("2d");if(!ctx)return;

    // full-res for export
    const full=document.createElement("canvas");
    drawCard(full,city,air,weather,0);
    onFull(full);

    const loop=()=>{
      tRef.current+=0.045;
      const t=tRef.current;
      // Redraw full card scaled
      const off=document.createElement("canvas");
      drawCard(off,city,air,weather,t);
      ctx.drawImage(off,0,0,270,480);
      // Embers
      if(Math.random()<0.4){
        embersRef.current.push({
          x:Math.random()*270,y:460,
          vx:(Math.random()-.5)*1.4,vy:-(1.8+Math.random()*2.8),
          r:1.5+Math.random()*2.5,a:.85+Math.random()*.15,
          c:Math.random()>.5?"#fbbf24":"#fb923c",
        });
      }
      embersRef.current=embersRef.current.filter(e=>e.a>0.04);
      embersRef.current.forEach(e=>{
        e.x+=e.vx;e.y+=e.vy;e.a-=0.018;e.r*=.996;
        ctx.save();ctx.globalAlpha=e.a;ctx.fillStyle=e.c;
        ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();ctx.restore();
      });
      rafRef.current=requestAnimationFrame(loop);
    };
    loop();
    return ()=>cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const cat=air.ispuNow?.category??"SEDANG";
  const th=THEME[cat]??DEFAULT_THEME;
  return(
    <div className="flex justify-center">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{width:270,height:480,border:`2px solid ${th.accent}55`}}>
        <canvas ref={cvRef} width={270} height={480} className="block w-full h-full"/>
        {/* Holographic shine overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{background:"linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 50%,rgba(255,255,255,0.04) 100%)"}}/>
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps{city:City;air:AirCity;weather:WeatherCity|undefined;onClose:()=>void;}
function ShareModal({city,air,weather,onClose}:ModalProps){
  const fullRef=useRef<HTMLCanvasElement|null>(null);
  const [status,setStatus]=useState<"idle"|"working"|"done">("idle");

  const getBlob=useCallback(():Promise<Blob>=>new Promise((res,rej)=>{
    const c=fullRef.current;
    if(!c){rej(new Error("no canvas"));return;}
    c.toBlob(b=>b?res(b):rej(new Error("toBlob failed")),"image/png");
  }),[]);

  const dl=useCallback(async()=>{
    setStatus("working");
    try{const blob=await getBlob();
      const url=URL.createObjectURL(blob);const a=document.createElement("a");
      a.href=url;a.download=`pyroalert-${city.id}.png`;a.click();URL.revokeObjectURL(url);
      setStatus("done");}catch{setStatus("idle");}
    setTimeout(()=>setStatus("idle"),2500);
  },[city.id,getBlob]);

  const shareImg=useCallback(async()=>{
    setStatus("working");
    try{const blob=await getBlob();
      const file=new File([blob],`pyroalert-${city.id}.png`,{type:"image/png"});
      if(navigator.canShare?.({files:[file]})){
        await navigator.share({title:`Udara ${city.name} — PyroAlert`,
          text:`ISPU ${air.ispuNow?.value??""} (${air.ispuNow?.label??""}) di ${city.name}`,files:[file]});
        setStatus("done");}else{await dl();return;}}
    catch{/*cancelled*/}
    setTimeout(()=>setStatus("idle"),2500);
  },[air.ispuNow,city,dl,getBlob]);

  const shareWA=useCallback(async()=>{
    setStatus("working");
    try{const blob=await getBlob();
      const file=new File([blob],`pyroalert-${city.id}.png`,{type:"image/png"});
      if(navigator.canShare?.({files:[file]})){
        await navigator.share({files:[file],title:`Udara ${city.name}`});
        setStatus("done");setTimeout(()=>setStatus("idle"),2500);return;}}
    catch{/*fall*/}
    const txt=`🔥 *Udara ${city.name}* ISPU *${air.ispuNow?.value??""} — ${air.ispuNow?.label??""}*\n\n📡 https://eduair.vercel.app/udara?kota=${city.id}\nvia @avlfarizii`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`,"_blank","noopener");
    setStatus("idle");
  },[air.ispuNow,city,getBlob]);

  const cat=air.ispuNow?.category??"SEDANG";
  const th=THEME[cat]??DEFAULT_THEME;
  const [ar,ag,ab]=th.rgb;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}/>
      <div className="relative z-10 w-full sm:max-w-[390px] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[96dvh] flex flex-col"
        style={{backdropFilter:"blur(32px)",
          border:`1px solid rgba(${ar},${ag},${ab},0.25)`,background:"#ffffff"}}>

        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200"/>
        </div>

        <div className="flex items-center justify-between px-5 pt-3 pb-3 flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:th.accent}}>
              Share as 9:16 Card
            </p>
            <p className="text-slate-900 font-black text-lg">{city.name}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700">
            <X size={15}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-2 min-h-0 flex flex-col items-center gap-2">
          <AnimatedPreview city={city} air={air} weather={weather}
            onFull={cv=>{fullRef.current=cv;}}/>
          <p className="text-[10px] text-slate-400 text-center">
            Live preview dengan animasi · PNG bersih saat diekspor
          </p>
        </div>

        <div className="flex-shrink-0 px-5 pb-6 pt-3 flex flex-col gap-2 border-t border-slate-100">
          <button onClick={shareImg} disabled={status==="working"}
            className="flex items-center justify-center gap-2.5 w-full rounded-2xl py-4 font-black text-sm text-white disabled:opacity-50 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{background:`linear-gradient(90deg,${th.accentDark},${th.accent})`}}>
            <Share2 size={17}/>
            {status==="working"?"Memproses…":status==="done"?"Berhasil! ✓":"Bagikan ke IG Story / lainnya"}
          </button>
          <button onClick={shareWA} disabled={status==="working"}
            className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1db954] text-white rounded-2xl py-3.5 font-bold text-sm disabled:opacity-50 active:scale-[0.98]">
            <MessageCircle size={17}/>Bagikan via WhatsApp
          </button>
          <button onClick={dl} disabled={status==="working"}
            className="flex items-center justify-center gap-2.5 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl py-3.5 font-bold text-sm disabled:opacity-50 active:scale-[0.98]">
            <Download size={17}/>Unduh PNG ke Galeri
          </button>
          <p className="text-center text-[10px] text-slate-400 px-2">
            💡 Unduh → buka galeri → share ke IG Story / WA Status
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ── Trigger button ────────────────────────────────────────────────────────────
interface ShareCardProps{city:City;air:AirCity|undefined;weather:WeatherCity|undefined;}
export function ShareCard({city,air,weather}:ShareCardProps){
  const [open,setOpen]=useState(false);
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  if(!air?.ispuNow)return null;
  const cat=air.ispuNow.category;
  const th=THEME[cat]??DEFAULT_THEME;
  return(
    <>
      <button onClick={()=>setOpen(true)}
        className="w-full flex items-center justify-between rounded-3xl bg-white border border-slate-200 hover:border-slate-300 px-5 py-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-px group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
            style={{background:`${th.accent}14`,border:`1.5px solid ${th.accent}35`}}>
            <Share2 size={17} style={{color:th.accent}}/>
          </div>
          <div className="text-left">
            <p className="font-black text-sm text-slate-800">Bagikan sebagai Gambar</p>
            <p className="text-xs text-slate-400">IG Story · WA Status · Download PNG</p>
          </div>
        </div>
        <div className="rounded-xl px-3 py-2 text-center"
          style={{background:`${th.accent}10`,border:`1.5px solid ${th.accent}28`}}>
          <p className="font-black text-lg tabular-nums" style={{color:th.accent}}>{air.ispuNow.value}</p>
          <p className="text-[10px] text-slate-400">ISPU</p>
        </div>
      </button>
      {mounted&&open&&air&&(
        <ShareModal city={city} air={air} weather={weather} onClose={()=>setOpen(false)}/>
      )}
    </>
  );
}
