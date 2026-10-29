"use client";
/**
 * ShareCard — animated canvas + MP4/WebM video export via MediaRecorder.
 *
 * The recording canvas MUST be attached to DOM for captureStream() to work
 * correctly in all browsers. We mount it hidden (opacity:0, position:absolute)
 * during recording, then remove it after.
 *
 * Share flow:
 *  1. Record 3s animation into MP4/WebM blob
 *  2. Try navigator.share({ files }) — on mobile this opens the OS share sheet
 *     where the user can pick Instagram, WhatsApp, etc.
 *  3. Fallback: auto-download the video file
 *
 * Spotify / Instagram direct: only works from native apps via UIPasteboard (iOS)
 * or Android Intent. From a browser the closest is navigator.share + file.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, X, MessageCircle, Video, Copy, Check } from "lucide-react";
import type { AirCity, WeatherCity } from "@/types/api";
import type { City } from "@/config/cities";

// ── Themes — NO emoji, pure colour ───────────────────────────────────────────
const THEME: Record<string, {
  dark: string; mid: string; light: string;
  accent: string; accentGlow: string;
  rgb: [number,number,number];
  label: string; statusWord: string;
}> = {
  BAIK: {
    dark:"#0a1f0a", mid:"#14532d", light:"#22c55e",
    accent:"#4ade80", accentGlow:"rgba(74,222,128,0.4)",
    rgb:[74,222,128], label:"BAIK", statusWord:"AMAN",
  },
  SEDANG: {
    dark:"#05132e", mid:"#1e3a5f", light:"#3b82f6",
    accent:"#60a5fa", accentGlow:"rgba(96,165,250,0.4)",
    rgb:[96,165,250], label:"SEDANG", statusWord:"WASPADA",
  },
  TIDAK_SEHAT: {
    dark:"#1c0d00", mid:"#7c2d12", light:"#f97316",
    accent:"#fb923c", accentGlow:"rgba(251,146,60,0.5)",
    rgb:[251,146,60], label:"TIDAK SEHAT", statusWord:"BERBAHAYA",
  },
  SANGAT_TIDAK_SEHAT: {
    dark:"#1a0000", mid:"#7f1d1d", light:"#dc2626",
    accent:"#f87171", accentGlow:"rgba(248,113,113,0.5)",
    rgb:[248,113,113], label:"SGT TDK SEHAT", statusWord:"SANGAT BERBAHAYA",
  },
  BERBAHAYA: {
    dark:"#000000", mid:"#0f172a", light:"#475569",
    accent:"#f43f5e", accentGlow:"rgba(244,63,94,0.6)",
    rgb:[244,63,94], label:"BERBAHAYA", statusWord:"KRISIS",
  },
};
const FB = THEME.SEDANG;

const SCHOOL_S: Record<string,string> = {
  NORMAL:"Normal", WASPADA:"Waspada", HYBRID:"Hybrid", DARING_DARURAT:"Darurat",
};

const CW=1080, CH=1920;

function rr(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  c.beginPath();c.roundRect(x,y,w,h,r);c.closePath();
}

// ── Flame ─────────────────────────────────────────────────────────────────────
function fl(c:CanvasRenderingContext2D,cx:number,by:number,sc:number,t:number,accent:string){
  const fw=28*sc,fh=60*sc,w=Math.sin(t*2.8)*5*sc;
  // outer
  c.save();c.beginPath();
  c.moveTo(cx,by);
  c.bezierCurveTo(cx-fw*.6,by-fh*.38,cx-fw*.3+w,by-fh*.76,cx,by-fh);
  c.bezierCurveTo(cx+fw*.3-w,by-fh*.76,cx+fw*.6,by-fh*.38,cx,by);
  const g=c.createLinearGradient(cx,by,cx,by-fh);
  g.addColorStop(0,"rgba(255,100,0,.9)");
  g.addColorStop(.4,accent+"cc");
  g.addColorStop(1,"rgba(255,255,180,.4)");
  c.fillStyle=g;c.fill();c.restore();
  // core
  c.save();c.beginPath();
  const w2=Math.sin(t*3.2+1)*3*sc;
  c.moveTo(cx,by-4*sc);
  c.bezierCurveTo(cx-fw*.3,by-fh*.44,cx-fw*.12+w2,by-fh*.74,cx,by-fh*.88);
  c.bezierCurveTo(cx+fw*.12-w2,by-fh*.74,cx+fw*.3,by-fh*.44,cx,by-4*sc);
  const g2=c.createLinearGradient(cx,by-fh*.88,cx,by);
  g2.addColorStop(0,"rgba(255,255,200,.9)");
  g2.addColorStop(1,"rgba(255,180,0,.3)");
  c.fillStyle=g2;c.fill();c.restore();
}

// ── Character — animated N95 figure, driven by time `t` ─────────────────────
// Animation phases (loop every 4s = t%25.1):
//   BAIK       : gentle bounce + wave arms
//   SEDANG     : slow bob + one hand raised warningly  
//   TIDAK_SEHAT: head tilt + arms cross protecting chest
//   SGT_TDK    : panic jump + both arms up
//   BERBAHAYA  : crouch low + arms cover head
function drawChar(c:CanvasRenderingContext2D, cx:number, baseY:number, cat:string, s:number, t=0){
  const shirt:{[k:string]:string}={
    BAIK:"#22c55e", SEDANG:"#3b82f6", TIDAK_SEHAT:"#ea580c",
    SANGAT_TIDAK_SEHAT:"#dc2626", BERBAHAYA:"#1e293b",
  };
  const sc=shirt[cat]??"#3b82f6";
  const skin="#f5c5a0", hair="#1e293b";
  const bW=88*s, bH=108*s, hR=50*s;

  // ── Per-category motion ──
  // bodyBob: vertical offset of whole body
  // headTilt: head rotation (radians)
  // eyeBlink: 0=open, 1=closed
  // armPhase: drives arm angle
  let bodyBob=0, headTilt=0, eyeBlink=0, armPhase=0, crouchAmt=0, bounceAmt=0;
  const loop = t % (Math.PI*2);

  if(cat==="BAIK"){
    bodyBob = Math.sin(t*2)*8*s;          // gentle bounce
    bounceAmt = Math.abs(Math.sin(t*2))*6*s;
    armPhase = t*1.2;                     // waving arms
    eyeBlink = loop > 5.8 && loop < 6.1 ? 1 : 0;
    headTilt = Math.sin(t*.8)*.06;
  } else if(cat==="SEDANG"){
    bodyBob = Math.sin(t*1.5)*5*s;
    armPhase = Math.sin(t*.9)*0.5;
    eyeBlink = loop > 5.9 && loop < 6.0 ? 1 : 0;
    headTilt = Math.sin(t*.5)*.04;
  } else if(cat==="TIDAK_SEHAT"){
    bodyBob = Math.sin(t*1.2)*4*s;
    headTilt = Math.sin(t*.6)*.08;
    armPhase = Math.sin(t*.7)*0.4;
    eyeBlink = loop > 4 && loop < 4.15 ? 1 : 0;
  } else if(cat==="SANGAT_TIDAK_SEHAT"){
    bodyBob = Math.sin(t*3)*12*s;         // panic bounce
    bounceAmt = Math.abs(Math.sin(t*3))*10*s;
    armPhase = t*2.5;                     // flailing
    headTilt = Math.sin(t*2.2)*.12;
    eyeBlink = loop > 2 && loop < 2.2 ? 1 : 0;
  } else { // BERBAHAYA
    crouchAmt = (1+Math.sin(t*.6))*.5*20*s; // crouching
    bodyBob = -crouchAmt;
    armPhase = Math.sin(t*.4)*0.3;
    headTilt = Math.sin(t*.3)*.05;
    eyeBlink = loop > 3.5 && loop < 3.65 ? 1 : 0;
  }

  const adjustedBaseY = baseY - bodyBob - bounceAmt;
  const headY = adjustedBaseY - bH*(1-crouchAmt/80) - hR - 4*s;

  // shadow (scales with bounce)
  c.save();c.globalAlpha=.12*(1-bounceAmt/50);c.fillStyle="#000";c.beginPath();
  c.ellipse(cx,baseY+10*s,54*s*(1+bounceAmt/60),10*s,0,0,Math.PI*2);c.fill();c.restore();

  // legs (crouch affects length)
  const legLen=(bH-crouchAmt)*.45;
  c.save();c.strokeStyle="#1e293b";c.lineWidth=20*s;c.lineCap="round";
  [-28*s,28*s].forEach(ox=>{
    c.beginPath();c.moveTo(cx+ox,adjustedBaseY-8*s);c.lineTo(cx+ox,adjustedBaseY+legLen);c.stroke();
    c.fillStyle="#334155";c.beginPath();
    c.ellipse(cx+ox+(ox>0?9:-9)*s,adjustedBaseY+legLen+8*s,18*s,9*s,ox>0?.2:-.2,0,Math.PI*2);c.fill();
  });c.restore();

  // body
  const bodyH=bH-crouchAmt*.4;
  c.save();c.fillStyle=sc;c.beginPath();
  c.moveTo(cx-bW/2,adjustedBaseY);
  c.quadraticCurveTo(cx-bW/2-8*s,adjustedBaseY-bodyH*.4,cx-bW/2+10*s,adjustedBaseY-bodyH);
  c.lineTo(cx+bW/2-10*s,adjustedBaseY-bodyH);
  c.quadraticCurveTo(cx+bW/2+8*s,adjustedBaseY-bodyH*.4,cx+bW/2,adjustedBaseY);
  c.closePath();c.fill();c.restore();

  // collar
  c.save();c.fillStyle="rgba(255,255,255,0.9)";c.beginPath();
  c.moveTo(cx-16*s,adjustedBaseY-bodyH+2*s);c.lineTo(cx,adjustedBaseY-bodyH+26*s);c.lineTo(cx+16*s,adjustedBaseY-bodyH+2*s);
  c.closePath();c.fill();c.restore();

  // animated arms
  const armBaseY=adjustedBaseY-bodyH*.38;
  const armDefs:(()=>[number,number,number,number,number,number][])[]=[
    ()=>{ // BAIK — waving
      const a=Math.sin(armPhase);
      return [
        [-bW/2,armBaseY,-bW/2-30*s,armBaseY-30*s-a*20*s,-bW/2-20*s,armBaseY-80*s-a*30*s],
        [ bW/2,armBaseY, bW/2+30*s,armBaseY-30*s+a*20*s, bW/2+20*s,armBaseY-80*s+a*30*s],
      ];
    },
    ()=>{ // SEDANG — one raised in caution
      const a=Math.sin(armPhase);
      return [
        [-bW/2,armBaseY,-bW/2-26*s,armBaseY-18*s,-bW/2-34*s,armBaseY+20*s],
        [ bW/2,armBaseY, bW/2+28*s,armBaseY-40*s+a*10*s, bW/2+18*s,armBaseY-90*s+a*15*s],
      ];
    },
    ()=>{ // TIDAK_SEHAT — crossed arms protection
      const a=Math.sin(armPhase)*.3;
      return [
        [-bW/2,armBaseY,-bW/2-10*s,armBaseY-15*s,cx+20*s,armBaseY-30*s+a*8*s],
        [ bW/2,armBaseY, bW/2+10*s,armBaseY-15*s,cx-20*s,armBaseY-20*s-a*8*s],
      ];
    },
    ()=>{ // SANGAT_TIDAK_SEHAT — flailing both up
      const a=Math.sin(armPhase);
      return [
        [-bW/2,armBaseY,-bW/2-40*s,armBaseY-60*s+a*15*s,-bW/2-28*s,armBaseY-120*s+a*20*s],
        [ bW/2,armBaseY, bW/2+40*s,armBaseY-60*s-a*15*s, bW/2+28*s,armBaseY-120*s-a*20*s],
      ];
    },
    ()=>{ // BERBAHAYA — arms low protecting
      const a=Math.sin(armPhase);
      return [
        [-bW/2,armBaseY,-bW/2-34*s,armBaseY+10*s+a*5*s,-bW/2-44*s,armBaseY+35*s+a*5*s],
        [ bW/2,armBaseY, bW/2+34*s,armBaseY+10*s-a*5*s, bW/2+44*s,armBaseY+35*s-a*5*s],
      ];
    },
  ];
  const catIdx=["BAIK","SEDANG","TIDAK_SEHAT","SANGAT_TIDAK_SEHAT","BERBAHAYA"].indexOf(cat);
  const armGetter=armDefs[Math.max(0,catIdx)]??armDefs[1];
  armGetter().forEach(([x1,y1,x2,y2,x3,y3])=>{
    c.save();c.strokeStyle=sc;c.lineWidth=18*s;c.lineCap="round";
    c.beginPath();c.moveTo(cx+x1,y1);c.quadraticCurveTo(cx+x2,y2,cx+x3,y3);c.stroke();
    c.fillStyle=skin;c.beginPath();c.arc(cx+x3,y3,12*s,0,Math.PI*2);c.fill();c.restore();
  });

  // head with tilt
  c.save();
  c.translate(cx,headY);
  c.rotate(headTilt);
  // face
  c.fillStyle=skin;c.beginPath();c.arc(0,0,hR,0,Math.PI*2);c.fill();
  // hair
  c.fillStyle=hair;c.beginPath();c.arc(0,-8*s,hR*1.02,Math.PI*1.12,Math.PI*1.88,false);c.fill();
  // ears
  [-1,1].forEach(side=>{
    c.fillStyle=skin;c.beginPath();c.ellipse(side*hR*.95,0,8*s,12*s,0,0,Math.PI*2);c.fill();
  });

  // animated eyes
  const eyeY=-8*s, eyeX=20*s;
  const blinkH=eyeBlink?2*s:9*s;
  if(cat==="BAIK"){
    if(eyeBlink){
      [-eyeX,eyeX].forEach(ox=>{c.strokeStyle=hair;c.lineWidth=4*s;c.beginPath();c.moveTo(ox-9*s,eyeY);c.lineTo(ox+9*s,eyeY);c.stroke();});
    } else {
      c.strokeStyle=hair;c.lineWidth=4*s;
      [-eyeX,eyeX].forEach(ox=>{c.beginPath();c.arc(ox,eyeY+4*s,9*s,Math.PI*1.15,Math.PI*1.85);c.stroke();});
    }
  } else if(cat==="BERBAHAYA"||cat==="SANGAT_TIDAK_SEHAT"){
    [-eyeX,eyeX].forEach((ox,i)=>{
      c.fillStyle=hair;c.beginPath();c.ellipse(ox,eyeY,9*s,eyeBlink?1.5*s:6*s,i===0?.3:-.3,0,Math.PI*2);c.fill();
      if(!eyeBlink){c.fillStyle="#fff";c.beginPath();c.arc(ox+2*s,eyeY-1.5*s,2*s,0,Math.PI*2);c.fill();}
      c.strokeStyle=hair;c.lineWidth=4*s;c.lineCap="round";c.beginPath();
      c.moveTo(ox-11*s,eyeY-16*s+(i===0?-5:5)*s);
      c.lineTo(ox+11*s,eyeY-16*s+(i===0?5:-5)*s);c.stroke();
    });
  } else {
    [-eyeX,eyeX].forEach(ox=>{
      c.fillStyle=hair;c.beginPath();c.ellipse(ox,eyeY,9*s,blinkH,0,0,Math.PI*2);c.fill();
      if(!eyeBlink){c.fillStyle="#fff";c.beginPath();c.arc(ox+2.5*s,eyeY-2*s,2.5*s,0,Math.PI*2);c.fill();}
    });
  }

  // N95 mask
  const mY=16*s, mW=hR*1.56, mH=hR*.68;
  const mC={BAIK:"#bbf7d0",SEDANG:"#bfdbfe",TIDAK_SEHAT:"#fed7aa",
    SANGAT_TIDAK_SEHAT:"#fecaca",BERBAHAYA:"#e2e8f0"}[cat]??"#e2e8f0";
  const mS={BAIK:"#16a34a",SEDANG:"#2563eb",TIDAK_SEHAT:"#ea580c",
    SANGAT_TIDAK_SEHAT:"#dc2626",BERBAHAYA:"#64748b"}[cat]??"#64748b";
  rr(c,cx-mW/2-cx,-mH/2+mY,mW,mH,14*s); // local coords after translate
  c.fillStyle=mC;c.fill();c.strokeStyle=mS;c.lineWidth=3*s;c.stroke();
  c.strokeStyle=mS+"60";c.lineWidth=2*s;
  for(let i=1;i<=2;i++){c.beginPath();c.moveTo(-mW*.36,-mH/2+mY+i*mH/3);c.lineTo(mW*.36,-mH/2+mY+i*mH/3);c.stroke();}
  c.fillStyle=mS;c.font=`bold ${12*s}px -apple-system,sans-serif`;
  c.textAlign="center";c.fillText("N95",0,mY+5*s);
  c.strokeStyle="#94a3b8";c.lineWidth=3*s;c.lineCap="round";
  [-1,1].forEach(sx=>{
    c.beginPath();c.moveTo(sx*mW*.48,mY-7*s);
    c.quadraticCurveTo(sx*(hR+14*s),mY-20*s,sx*(hR-2*s),-14*s);c.stroke();
  });
  c.restore();
}

// ── Draw one frame ────────────────────────────────────────────────────────────
// qrImg: optional pre-rendered QR code image element (async generated before recording)
function drawFrame(
  cv:HTMLCanvasElement, city:City, air:AirCity,
  weather:WeatherCity|undefined, t:number,
  qrImg?: HTMLImageElement | null,
){
  const c=cv.getContext("2d");if(!c)return;
  if(cv.width!==CW){cv.width=CW;cv.height=CH;}

  const cat=air.ispuNow?.category??"SEDANG";
  const th=THEME[cat]??FB;
  const ispu=air.ispuNow?.value??0;
  const pm25=air.pm25??0;
  const i24=air.ispu24h?.value??null;
  const temp=weather?.temp!=null?`${Math.round(weather.temp)}C`:"--";
  const wind=weather?.windKmh!=null?`${Math.round(weather.windKmh)} km/j`:"--";
  const rh=weather?.rh!=null?`${Math.round(weather.rh)}%`:"--";
  const school=SCHOOL_S[air.status.code]??air.status.label;
  const now=new Date();
  const dateStr=new Intl.DateTimeFormat("id-ID",{timeZone:city.tz,weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(now);
  const timeStr=new Intl.DateTimeFormat("id-ID",{timeZone:city.tz,hour:"2-digit",minute:"2-digit",hour12:false}).format(now)+" "+city.tzLabel;
  const [ar,ag,ab]=th.rgb;

  // ── BG ──
  const bg=c.createLinearGradient(0,0,0,CH);
  bg.addColorStop(0,th.dark);bg.addColorStop(.42,th.mid);bg.addColorStop(.7,th.light+"88");
  bg.addColorStop(.85,"#fbbf24");bg.addColorStop(1,"#fef3c7");
  c.fillStyle=bg;c.fillRect(0,0,CW,CH);

  // spotlight
  const sp=c.createRadialGradient(CW/2,CH*.35,40,CW/2,CH*.35,580);
  sp.addColorStop(0,"rgba(255,255,255,0.08)");sp.addColorStop(1,"transparent");
  c.fillStyle=sp;c.fillRect(0,0,CW,CH*.75);

  // vignette edges
  const vig=c.createRadialGradient(CW/2,CH*.4,300,CW/2,CH*.4,750);
  vig.addColorStop(0,"transparent");vig.addColorStop(1,"rgba(0,0,0,0.55)");
  c.fillStyle=vig;c.fillRect(0,0,CW,CH*.8);

  // ── Ground + flames ──
  const gY=CH*.775;
  const gGr=c.createLinearGradient(0,gY,0,CH);
  gGr.addColorStop(0,`rgba(${ar},${ag},${ab},0.45)`);
  gGr.addColorStop(.5,"rgba(251,146,60,0.6)");
  gGr.addColorStop(1,"rgba(254,240,138,0.95)");
  c.fillStyle=gGr;c.fillRect(0,gY,CW,CH-gY);

  [.055,.14,.24,.34,.46,.57,.67,.77,.87,.95].forEach((fx,i)=>
    fl(c,fx*CW,gY,.85+Math.sin(i*.9)*.3,t+i*.55,th.accent));

  // animated embers
  for(let i=0;i<55;i++){
    const phase=t*1.1+i*1.37;
    const ex=((i*137.5+t*38)%CW);
    const ey=gY-((phase*22+i*18)%(gY*.8))-gY*.04;
    if(ey<0||ey>gY)continue;
    const er=1.2+(i%5)*.6;
    const alpha=.25+(Math.sin(phase*4+i)*.5+.5)*.5;
    c.save();c.globalAlpha=alpha;
    c.fillStyle=i%3===0?th.accent:i%3===1?"#fbbf24":"#fb923c";
    c.beginPath();c.arc(ex,ey,er,0,Math.PI*2);c.fill();c.restore();
  }

  // ── Top pill — full width brand bar ──
  c.fillStyle="rgba(255,255,255,0.11)";
  rr(c,56,58,CW-112,70,35);c.fill();
  c.fillStyle="#fff";
  c.font="bold 28px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="left";
  c.fillText("PyroAlert  Karhutla 26",92,103);
  c.textAlign="right";
  c.fillStyle="rgba(255,255,255,0.55)";
  c.font="26px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText(timeStr,CW-80,103);

  // ── Province + City — FULLY CENTERED ──
  c.textAlign="center";
  c.fillStyle="rgba(255,255,255,0.48)";
  c.font="34px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText(city.province.toUpperCase(),CW/2,210);
  c.fillStyle="#ffffff";
  const cityFontSize=city.name.length>12?70:city.name.length>8?84:96;
  c.font=`bold ${cityFontSize}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
  c.fillText(city.name,CW/2,330);

  // ── ISPU number — FULLY CENTERED, large ──
  const numGlow=c.createRadialGradient(CW/2,650,30,CW/2,650,340);
  numGlow.addColorStop(0,"rgba(255,255,255,0.20)");
  numGlow.addColorStop(1,"transparent");
  c.fillStyle=numGlow;c.fillRect(0,380,CW,420);

  c.fillStyle="#ffffff";
  c.textAlign="center";
  // Auto-fit font size so ISPU number never overflows 70% of card width
  const maxNumW = CW * 0.72;
  let ispuFontSize = ispu >= 300 ? 280 : ispu >= 100 ? 310 : 340;
  c.font=`900 ${ispuFontSize}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
  while(c.measureText(String(ispu)).width > maxNumW && ispuFontSize > 160){
    ispuFontSize -= 10;
    c.font=`900 ${ispuFontSize}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
  }
  c.fillText(String(ispu),CW/2,720);

  // Accent underline — centered
  const lineHalfW=240;
  const lineY=736;
  const lg=c.createLinearGradient(CW/2-lineHalfW,lineY,CW/2+lineHalfW,lineY);
  lg.addColorStop(0,"transparent");
  lg.addColorStop(0.5,th.accent);
  lg.addColorStop(1,"transparent");
  c.strokeStyle=lg;c.lineWidth=5;
  c.beginPath();c.moveTo(CW/2-lineHalfW,lineY);c.lineTo(CW/2+lineHalfW,lineY);c.stroke();

  // ── Category badge — CENTERED pill ──
  const bdgW=340,bdgH=64;
  const bdgX=CW/2-bdgW/2;
  rr(c,bdgX,752,bdgW,bdgH,32);
  c.fillStyle=`rgba(${ar},${ag},${ab},0.25)`;c.fill();
  c.strokeStyle=th.accent;c.lineWidth=2;c.stroke();
  c.fillStyle=th.accent;
  c.font="bold 36px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="center";
  c.fillText(th.label,CW/2,791);

  // Status word — centered
  c.fillStyle="rgba(255,255,255,0.65)";
  c.font="700 30px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText(th.statusWord+" UDARA",CW/2,840);

  // Desc — centered
  const descMap:{[k:string]:string}={
    BAIK:"Aman beraktivitas di luar ruangan",
    SEDANG:"Bisa keluar, tetap perhatikan gejala",
    TIDAK_SEHAT:"Kurangi aktivitas di luar rumah",
    SANGAT_TIDAK_SEHAT:"Hindari keluar rumah sebisa mungkin",
    BERBAHAYA:"Tetap di dalam — tutup semua ventilasi",
  };
  c.fillStyle="rgba(255,255,255,0.45)";
  c.font="28px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText(descMap[cat]??"",CW/2,890);

  // ── Character — drawn LAST (after card) so always visible ──
  // Positioned bottom-right, peeking above card top edge
  // ── White card ──
  const cdX=52,cdY=CH*.54,cdW=CW-104,cdH=CH-cdY-60;
  c.save();
  c.shadowColor="rgba(0,0,0,0.18)";c.shadowBlur=70;c.shadowOffsetY=18;
  rr(c,cdX,cdY,cdW,cdH,56);c.fillStyle="#fff";c.fill();
  c.restore();
  // accent stripe top of card
  rr(c,cdX,cdY,cdW,12,6);c.fillStyle=th.accent;c.fill();

  const cCX=cdX+cdW/2;

  // card heading
  c.fillStyle="#0f172a";
  c.font="bold 36px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="center";c.fillText("Laporan Kualitas Udara",cCX,cdY+76);
  c.strokeStyle="#f1f5f9";c.lineWidth=1.5;c.beginPath();
  c.moveTo(cdX+48,cdY+106);c.lineTo(cdX+cdW-48,cdY+106);c.stroke();

  // stats grid 3x2
  const stats=[
    {l:"PM2.5",  v:`${pm25.toFixed(1)} ug`},
    {l:"ISPU 24j",v:i24!=null?String(i24):"--"},
    {l:"Suhu",   v:temp},
    {l:"Angin",  v:wind},
    {l:"Kelembapan",v:rh},
    {l:"Sekolah",v:school},
  ];
  const gW=(cdW-64)/3,gH=132,gSX=cdX+32,gSY=cdY+116;
  stats.forEach((s,i)=>{
    const col=i%3,row=Math.floor(i/3);
    const bx=gSX+col*gW+4,by=gSY+row*gH+4;
    rr(c,bx,by,gW-8,gH-10,18);
    c.fillStyle=col===0?`rgba(${ar},${ag},${ab},0.07)`:"#f8fafc";c.fill();
    const cx2=bx+(gW-8)/2;
    c.fillStyle="#94a3b8";c.font="19px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
    c.textAlign="center";c.fillText(s.l.toUpperCase(),cx2,by+32);
    c.fillStyle=i===5?th.accent:"#0f172a";
    c.font=`bold ${s.v.length>7?26:32}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
    c.fillText(s.v,cx2,by+82);
  });

  // date strip
  const dY=gSY+2*gH+12;
  rr(c,cdX+42,dY,cdW-84,56,14);c.fillStyle="#f1f5f9";c.fill();
  c.fillStyle="#64748b";c.font="24px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="center";c.fillText(dateStr,cCX,dY+36);

  // URL
  rr(c,cdX+42,dY+68,cdW-84,48,12);c.fillStyle="#f8fafc";c.fill();
  c.fillStyle="#94a3b8";c.font="20px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText("eduair.vercel.app/udara?kota="+city.id,cCX,dY+100);

  // footer separator
  const fY=dY+126;
  c.strokeStyle="#f1f5f9";c.lineWidth=1.5;c.beginPath();
  c.moveTo(cdX+56,fY);c.lineTo(cdX+cdW-56,fY);c.stroke();

  // ── QR + character CTA section ──
  const qrSize=150;
  const qrX=cdX+52;
  const qrY=fY+16;

  // QR code box
  rr(c,qrX,qrY,qrSize,qrSize,16);
  c.fillStyle="#f8fafc";c.fill();
  c.strokeStyle="#e2e8f0";c.lineWidth=2;c.stroke();
  if(qrImg){
    c.drawImage(qrImg,qrX+8,qrY+8,qrSize-16,qrSize-16);
  } else {
    // Fallback: draw QR frame decoration
    c.strokeStyle=th.accent;c.lineWidth=3;
    // Corner marks
    const cm=20;const ci=12;
    [[qrX+8,qrY+8],[qrX+qrSize-8-cm,qrY+8],[qrX+8,qrY+qrSize-8-cm]].forEach(([fx,fy])=>{
      c.strokeRect(fx,fy,cm,cm);
      c.fillStyle=th.accent+"44";rr(c,fx+4,fy+4,ci,ci,4);c.fill();
    });
    c.fillStyle=th.accent;c.font=`bold 16px sans-serif`;
    c.textAlign="center";c.fillText("QR",qrX+qrSize/2,qrY+qrSize/2+6);
  }
  // "Scan" label under QR
  c.fillStyle="#94a3b8";c.font="18px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="center";c.fillText("Scan untuk cek real-time",qrX+qrSize/2,qrY+qrSize+26);

  // Speech bubble (right of QR) — always white/light background
  const sbX=qrX+qrSize+28;
  const sbY=qrY;
  const sbW=cdW-qrSize-52-80;
  const sbH=qrSize;
  // Bubble body — white bg always
  rr(c,sbX,sbY,sbW,sbH,20);
  c.fillStyle="#f8fafc";c.fill();
  c.strokeStyle="#e2e8f0";c.lineWidth=1.5;c.stroke();
  // Bubble tail (pointing left toward QR)
  c.fillStyle="#f8fafc";
  c.beginPath();c.moveTo(sbX,sbY+40);c.lineTo(sbX-20,sbY+55);c.lineTo(sbX,sbY+70);c.closePath();c.fill();

  // CTA text in bubble — always dark slate regardless of theme
  const ctaLines=[
    "Pantau udara kotamu",
    "setiap saat — gratis,",
    "tanpa install app!",
  ];
  c.fillStyle="#1e293b";
  c.textAlign="left";
  const ctaFontSize=sbW<260?20:22;
  c.font=`bold ${ctaFontSize}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
  ctaLines.forEach((line,i)=>c.fillText(line,sbX+18,sbY+34+i*32));

  c.fillStyle="#64748b";c.font=`${ctaFontSize-2}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
  c.fillText("eduair.vercel.app",sbX+18,sbY+sbH-22);

  // Branding footer
  const brandY=qrY+qrSize+52;
  c.strokeStyle="#f1f5f9";c.lineWidth=1;c.beginPath();
  c.moveTo(cdX+56,brandY);c.lineTo(cdX+cdW-56,brandY);c.stroke();
  c.fillStyle=th.accent;
  c.font="bold 22px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.textAlign="center";c.fillText("PyroAlert Karhutla 26",cCX,brandY+36);
  c.fillStyle="#94a3b8";c.font="20px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText("by Muhammad Salman Al Farisi  @avlfarizii",cCX,brandY+60);

  // disclaimer
  c.fillStyle="rgba(148,163,184,0.55)";c.font="18px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  c.fillText("Data estimasi CAMS  Bukan alat ukur resmi BMKG",CW/2,CH-48);

  // ── Character drawn LAST so it always appears on top of everything ──
  // Positioned right side, feet at card top edge, peeking up from card
  drawChar(c, CW*0.81, cdY+30, cat, 1.18, t);
}

// ── Generate QR code as HTMLImageElement (async, cached) ─────────────────────
async function generateQRImage(url: string): Promise<HTMLImageElement> {
  // Use the qrcode package (already a project dependency)
  const QRCode = (await import("qrcode")).default;
  const dataUrl = await QRCode.toDataURL(url, {
    width: 280, margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = dataUrl;
  });
}

// ── Animated preview ──────────────────────────────────────────────────────────
type Ember={x:number;y:number;vx:number;vy:number;r:number;a:number;col:string};

interface PreviewProps{
  city:City;air:AirCity;weather:WeatherCity|undefined;
  /** Called with the live preview canvas so we can reuse it for recording */
  onCanvasReady:(cv:HTMLCanvasElement)=>void;
}
function LivePreview({city,air,weather,onCanvasReady}:PreviewProps){
  const wrapRef=useRef<HTMLDivElement>(null);
  const ref=useRef<HTMLCanvasElement>(null);
  const tRef=useRef(0);
  const rafRef=useRef(0);
  const embersRef=useRef<Ember[]>([]);
  const qrImgRef=useRef<HTMLImageElement|null>(null);
  // Actual pixel dimensions used for preview rendering (updated on resize)
  const dimRef=useRef({w:270,h:480});

  const cat=air.ispuNow?.category??"SEDANG";
  const th=THEME[cat]??FB;

  // Generate QR once asynchronously
  useEffect(()=>{
    const url=`https://eduair.vercel.app/udara?kota=${city.id}`;
    generateQRImage(url).then(img=>{qrImgRef.current=img;}).catch(()=>{});
  },[city.id]);

  useEffect(()=>{
    const cv=ref.current;
    const wrap=wrapRef.current;
    if(!cv||!wrap)return;

    // Measure container and size canvas to fill it (9:16 ratio)
    const measureAndSize=()=>{
      const maxW=wrap.clientWidth||270;
      // Cap at 390 so it doesn't become huge on desktop
      const pw=Math.min(maxW,390);
      const ph=Math.round(pw*(16/9));
      dimRef.current={w:pw,h:ph};
      cv.width=pw;cv.height=ph;
      cv.style.width=`${pw}px`;
      cv.style.height=`${ph}px`;
    };
    measureAndSize();

    // Watch for container resize (e.g. sheet animation finishing)
    const ro=new ResizeObserver(()=>{measureAndSize();});
    ro.observe(wrap);

    const ctx=cv.getContext("2d");if(!ctx)return;

    // Notify parent so it can reuse this canvas ref
    onCanvasReady(cv);

    const loop=()=>{
      tRef.current+=0.048;
      const t=tRef.current;
      const {w,h}=dimRef.current;

      // Draw full frame at 1080×1920 then scale down into preview
      const off=document.createElement("canvas");
      off.width=CW;off.height=CH;
      drawFrame(off,city,air,weather,t,qrImgRef.current);
      ctx.drawImage(off,0,0,w,h);

      // Ember particles scaled to preview size
      const scaleX=w/270, scaleY=h/480;
      if(Math.random()<.45) embersRef.current.push({
        x:Math.random()*w,y:h*.88,
        vx:(Math.random()-.5)*1.5*scaleX,vy:-(2+Math.random()*3)*scaleY,
        r:(1.2+Math.random()*2.4)*Math.min(scaleX,scaleY),a:.9,
        col:[th.accent,"#fbbf24","#fb923c"][Math.floor(Math.random()*3)],
      });
      embersRef.current=embersRef.current.filter(e=>e.a>.04);
      embersRef.current.forEach(e=>{
        e.x+=e.vx;e.y+=e.vy;e.a-=.017;e.r*=.994;
        ctx.save();ctx.globalAlpha=e.a;ctx.fillStyle=e.col;
        ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();ctx.restore();
      });
      rafRef.current=requestAnimationFrame(loop);
    };
    loop();
    return ()=>{cancelAnimationFrame(rafRef.current);ro.disconnect();};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return(
    <div ref={wrapRef} className="w-full flex justify-center">
      <div className="relative rounded-3xl overflow-hidden"
        style={{
          width:"100%",maxWidth:390,
          aspectRatio:"9/16",
          boxShadow:`0 0 40px ${th.accentGlow}, 0 8px 32px rgba(0,0,0,0.4)`,
          border:`1.5px solid ${th.accent}55`,
        }}>
        {/* Canvas fills the wrapper; actual pixel size set by JS above */}
        <canvas ref={ref} className="block w-full h-full"/>
        <div className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{background:"linear-gradient(130deg,rgba(255,255,255,0.07) 0%,transparent 60%)"}}/>
      </div>
    </div>
  );
}

// ── Record from a DOM-attached canvas ────────────────────────────────────────
// We create a separate full-res recording canvas, append it invisibly to body,
// record, then remove. This ensures captureStream() works in all browsers.
function recordFromCanvas(
  city:City, air:AirCity, weather:WeatherCity|undefined,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Create full-res canvas and attach to DOM (required for captureStream)
    const cv = document.createElement("canvas");
    cv.width = CW; cv.height = CH;
    cv.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
    document.body.appendChild(cv);

    const supportedType = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
      ? "video/mp4;codecs=avc1"
      : MediaRecorder.isTypeSupported("video/mp4")
      ? "video/mp4"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";

    let stream: MediaStream;
    try {
      stream = (cv as HTMLCanvasElement & { captureStream(fps:number):MediaStream }).captureStream(30);
    } catch {
      document.body.removeChild(cv);
      reject(new Error("captureStream not supported"));
      return;
    }

    const recorder = new MediaRecorder(stream, {
      mimeType: supportedType,
      videoBitsPerSecond: 6_000_000,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      document.body.removeChild(cv);
      const finalType = supportedType.startsWith("video/mp4") ? "video/mp4" : "video/webm";
      resolve(new Blob(chunks, { type: finalType }));
    };
    recorder.onerror = () => {
      document.body.removeChild(cv);
      reject(new Error("MediaRecorder error"));
    };

    const DURATION_SEC = 15;
    const FPS = 30;
    const TOTAL_FRAMES = DURATION_SEC * FPS;
    let frame = 0;
    let t = 0;
    let qrImg: HTMLImageElement | null = null;

    // Generate QR async, then start recording
    generateQRImage(`https://eduair.vercel.app/udara?kota=${city.id}`)
      .then(img => { qrImg = img; })
      .catch(() => {})
      .finally(() => {
        recorder.start(100); // collect in 100ms chunks

        const tick = () => {
          t += 0.055;
          frame++;
          drawFrame(cv, city, air, weather, t, qrImg);
          if (frame < TOTAL_FRAMES) {
            requestAnimationFrame(tick);
          } else {
            recorder.stop();
          }
        };
        requestAnimationFrame(tick);
      });
  });
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps{city:City;air:AirCity;weather:WeatherCity|undefined;onClose:()=>void;}
function ShareModal({city,air,weather,onClose}:ModalProps){
  const previewCanvasRef=useRef<HTMLCanvasElement|null>(null);
  const qrImgRef=useRef<HTMLImageElement|null>(null);
  const [status,setStatus]=useState<"idle"|"recording"|"working"|"done"|"error">("idle");
  const [copied,setCopied]=useState(false);
  const [recordSupport]=useState(()=>{
    if(typeof window==="undefined")return false;
    if(!("MediaRecorder" in window))return false;
    const cv=document.createElement("canvas");
    return typeof (cv as {captureStream?:unknown}).captureStream==="function";
  });

  // Generate QR once for PNG export
  useEffect(()=>{
    const url=`https://eduair.vercel.app/udara?kota=${city.id}`;
    generateQRImage(url).then(img=>{qrImgRef.current=img;}).catch(()=>{});
  },[city.id]);

  // ── Professional caption — built once per render ──────────────────────────
  const caption = (()=>{
    const now=new Date();
    const dateStr=new Intl.DateTimeFormat("id-ID",{timeZone:city.tz,weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(now);
    const timeStr=new Intl.DateTimeFormat("id-ID",{timeZone:city.tz,hour:"2-digit",minute:"2-digit",hour12:false}).format(now)+" "+city.tzLabel;
    const cat=air.ispuNow?.category??"SEDANG";
    const th=THEME[cat]??FB;
    const adviceMap:Record<string,string>={
      BAIK:"Kondisi udara baik. Aktivitas luar ruangan aman dilakukan.",
      SEDANG:"Kualitas udara sedang. Kelompok sensitif disarankan mengurangi aktivitas berat di luar ruangan.",
      TIDAK_SEHAT:"Kualitas udara tidak sehat. Kurangi waktu di luar dan gunakan masker N95.",
      SANGAT_TIDAK_SEHAT:"Kualitas udara sangat tidak sehat. Hindari aktivitas luar ruangan. Gunakan masker N95 atau KN95.",
      BERBAHAYA:"Kualitas udara berbahaya. Tetap di dalam ruangan dan tutup semua ventilasi.",
    };
    const school=SCHOOL_S[air.status.code]??air.status.label;
    return [
      `KONDISI UDARA ${city.name.toUpperCase()}`,
      `${dateStr.toUpperCase()} | ${timeStr}`,
      ``,
      `ISPU Sekarang    : ${air.ispuNow?.value??"--"} (${th.label})`,
      `Rata-rata 24 jam : ${air.ispu24h?.value??"--"}`,
      `PM2.5            : ${air.pm25?.toFixed(1)??"--"} ug/m3`,
      `Status Sekolah   : ${school}`,
      ``,
      adviceMap[cat]??"",
      ``,
      `Sumber data: Open-Meteo CAMS dan NASA FIRMS.`,
      `Data bersifat estimasi model atmosfer, bukan pengganti informasi resmi BMKG.`,
      ``,
      `Pantau real-time: eduair.vercel.app/udara?kota=${city.id}`,
      `PyroAlert Karhutla 2026 — dibuat oleh Muhammad Salman Al Farisi`,
    ].join("\n");
  })();

  // PNG from current preview canvas frame
  const getPng=useCallback(():Promise<Blob>=>new Promise((res,rej)=>{
    const cv=previewCanvasRef.current;if(!cv){rej(new Error("no canvas"));return;}
    // Draw a fresh full-res frame, scale down
    const full=document.createElement("canvas");
    full.width=CW;full.height=CH;
    drawFrame(full,city,air,weather,0,qrImgRef.current);
    full.toBlob(b=>b?res(b):rej(new Error("toBlob")),"image/png");
  }),[city,air,weather]);

  const dl=useCallback(async()=>{
    setStatus("working");
    try{
      const blob=await getPng();
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;a.download=`pyroalert-${city.id}.png`;a.click();
      URL.revokeObjectURL(url);
      setStatus("done");
    }catch{setStatus("error");}
    setTimeout(()=>setStatus("idle"),2500);
  },[city.id,getPng]);

  const shareVideo=useCallback(async()=>{
    setStatus("recording");
    try{
      const blob=await recordFromCanvas(city,air,weather);
      const isMP4=blob.type.includes("mp4");
      const ext=isMP4?"mp4":"webm";
      const file=new File([blob],`pyroalert-${city.id}.${ext}`,{type:blob.type});
      // Try Web Share API with file (works on iOS Safari, Chrome Android)
      if(typeof navigator.canShare==="function"&&navigator.canShare({files:[file]})){
        await navigator.share({
          title:`Kondisi Udara ${city.name} — PyroAlert`,
          text:caption,
          files:[file],
        });
        setStatus("done");
      } else {
        // Desktop / unsupported: download the file
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");
        a.href=url;a.download=`pyroalert-${city.id}.${ext}`;a.click();
        URL.revokeObjectURL(url);
        setStatus("done");
      }
    }catch(e){
      // User cancelled or failed
      if(!(e instanceof DOMException&&e.name==="AbortError")) setStatus("error");
      else setStatus("idle");
    }
    setTimeout(()=>setStatus("idle"),3000);
  },[air,city,weather]);

  const shareImg=useCallback(async()=>{
    setStatus("working");
    try{
      const blob=await getPng();
      const file=new File([blob],`pyroalert-${city.id}.png`,{type:"image/png"});
      if(typeof navigator.canShare==="function"&&navigator.canShare({files:[file]})){
        await navigator.share({
          title:`Udara ${city.name} — PyroAlert`,
          text:`ISPU ${air.ispuNow?.value??""} di ${city.name}`,
          files:[file],
        });
        setStatus("done");
      } else { await dl(); return; }
    }catch(e){
      if(!(e instanceof DOMException&&e.name==="AbortError")) await dl();
      else setStatus("idle");
    }
    setTimeout(()=>setStatus("idle"),2500);
  },[air.ispuNow,city,dl,getPng]);

  const shareWA=useCallback(async()=>{
    setStatus("working");
    try{
      const blob=await getPng();
      const file=new File([blob],`pyroalert-${city.id}.png`,{type:"image/png"});
      if(typeof navigator.canShare==="function"&&navigator.canShare({files:[file]})){
        await navigator.share({files:[file],title:`Udara ${city.name}`});
        setStatus("done");setTimeout(()=>setStatus("idle"),2500);return;
      }
    }catch{/*fallthrough*/}
    const txt=caption;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`,"_blank","noopener");
    setStatus("idle");
  },[air.ispuNow,city,getPng]);

  // cat/th for modal JSX styling
  const cat=air.ispuNow?.category??"SEDANG";
  const th=THEME[cat]??FB;

  const statusLabel:{[k:string]:string}={
    idle:"",recording:"Merekam video 15 detik...",
    working:"Memproses...",done:"Berhasil!",error:"Gagal, coba lagi",
  };

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={status==="idle"?onClose:undefined}/>
      <div className="relative z-10 w-full sm:max-w-[390px] bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[96dvh] flex flex-col">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200"/>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:th.accent}}>
              Bagikan kartu animasi
            </p>
            <p className="text-slate-900 font-black text-lg">{city.name}</p>
          </div>
          <button onClick={onClose} disabled={status==="recording"}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-40">
            <X size={15}/>
          </button>
        </div>

        {/* Live preview */}
        <div className="flex-1 overflow-y-auto px-5 pb-2 min-h-0 flex flex-col items-center gap-2">
          <LivePreview city={city} air={air} weather={weather}
            onCanvasReady={cv=>{previewCanvasRef.current=cv;}}/>

          {status==="recording" && (
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"/>
              Merekam animasi 15 detik...
            </div>
          )}
          {status!=="recording" && (
            <p className="text-[10px] text-slate-400 text-center">
              Preview animasi live · video bergerak saat dibagikan
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex-shrink-0 px-5 pb-6 pt-3 flex flex-col gap-2 border-t border-slate-100">

          {/* VIDEO (MP4 animated) — the main CTA */}
          {recordSupport && (
            <button onClick={shareVideo} disabled={status!=="idle"}
              className="flex items-center justify-center gap-2.5 w-full rounded-2xl py-4 font-black text-sm text-white disabled:opacity-55 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{background:`linear-gradient(90deg,${th.mid},${th.accent})`}}>
              <Video size={17}/>
              {status==="idle" ? "Bagikan Video Animasi (IG / WA)" : statusLabel[status]}
            </button>
          )}

          {/* PNG image share */}
          <button onClick={shareImg} disabled={status!=="idle"}
            className="flex items-center justify-center gap-2.5 w-full rounded-2xl py-3.5 font-bold text-sm text-white disabled:opacity-55 active:scale-[0.98]"
            style={{background:th.accent}}>
            <Share2 size={16}/>
            {status==="working"||status==="done" ? statusLabel[status] : "Bagikan Gambar (PNG)"}
          </button>

          {/* WhatsApp */}
          <button onClick={shareWA} disabled={status!=="idle"}
            className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1db954] text-white rounded-2xl py-3.5 font-bold text-sm disabled:opacity-55 active:scale-[0.98]">
            <MessageCircle size={16}/>WhatsApp
          </button>

          {/* Download PNG */}
          <button onClick={dl} disabled={status!=="idle"}
            className="flex items-center justify-center gap-2.5 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl py-3.5 font-bold text-sm disabled:opacity-55 active:scale-[0.98]">
            <Download size={16}/>Unduh PNG
          </button>

          {/* Copy caption */}
          <button
            onClick={async()=>{
              try{await navigator.clipboard.writeText(caption);setCopied(true);setTimeout(()=>setCopied(false),2500);}
              catch{/* ignore */}
            }}
            disabled={status!=="idle"}
            className="flex items-center justify-center gap-2.5 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-2xl py-3 font-semibold text-sm disabled:opacity-55 active:scale-[0.98] transition-all">
            {copied ? <Check size={15} className="text-emerald-500"/> : <Copy size={15}/>}
            {copied ? "Teks caption disalin!" : "Salin caption teks"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ── Trigger ───────────────────────────────────────────────────────────────────
interface ShareCardProps{city:City;air:AirCity|undefined;weather:WeatherCity|undefined;}
export function ShareCard({city,air,weather}:ShareCardProps){
  const [open,setOpen]=useState(false);
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  if(!air?.ispuNow)return null;
  const cat=air.ispuNow.category;
  const th=THEME[cat]??FB;
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
            <p className="font-black text-sm text-slate-800">Bagikan Kartu Animasi</p>
            <p className="text-xs text-slate-400">Video · IG Story · WA Status · PNG</p>
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

