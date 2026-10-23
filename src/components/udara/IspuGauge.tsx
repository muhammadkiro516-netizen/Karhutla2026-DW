"use client";
/**
 * IspuGauge — animated SVG semicircle gauge 0–500.
 * Segments coloured by KLHK official ISPU categories.
 * Needle animates to current value.
 * Shows current vs 24-h average side by side.
 */
import { useEffect, useRef, useState } from "react";
import type { AirCity } from "@/types/api";

const W = 280;
const H = 160;
const CX = W / 2;
const CY = H - 20;
const R_OUTER = 120;
const R_INNER = 84;
const R_NEEDLE = 108;

// KLHK ISPU segments [start, end, hex colour, label]
const SEGMENTS = [
  { lo: 0,   hi: 50,  color: "#16a34a", label: "Baik" },
  { lo: 50,  hi: 100, color: "#2563eb", label: "Sedang" },
  { lo: 100, hi: 200, color: "#eab308", label: "Tidak Sehat" },
  { lo: 200, hi: 300, color: "#dc2626", label: "Sgt Tdk Sehat" },
  { lo: 300, hi: 500, color: "#111827", label: "Berbahaya" },
] as const;

// Map ISPU value 0–500 → angle -90° to 90° (semicircle)
function ispuToAngle(v: number): number {
  const clamped = Math.max(0, Math.min(500, v));
  return -90 + (clamped / 500) * 180;
}

function polarXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rInner: number, rOuter: number, startDeg: number, endDeg: number): string {
  const s1 = polarXY(cx, cy, rOuter, startDeg);
  const e1 = polarXY(cx, cy, rOuter, endDeg);
  const s2 = polarXY(cx, cy, rInner, endDeg);
  const e2 = polarXY(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

function Needle({ angleDeg }: { angleDeg: number }) {
  const tip = polarXY(CX, CY, R_NEEDLE, angleDeg);
  const base1 = polarXY(CX, CY, 10, angleDeg + 90);
  const base2 = polarXY(CX, CY, 10, angleDeg - 90);
  return (
    <g>
      <polygon
        points={`${tip.x},${tip.y} ${base1.x},${base1.y} ${base2.x},${base2.y}`}
        fill="#1e293b"
        opacity={0.85}
        style={{ transition: "all 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
      <circle cx={CX} cy={CY} r={8} fill="#1e293b" />
      <circle cx={CX} cy={CY} r={4} fill="white" />
    </g>
  );
}

interface IspuGaugeProps {
  air: AirCity | undefined;
}

export function IspuGauge({ air }: IspuGaugeProps) {
  const ispuNow = air?.ispuNow?.value ?? null;
  const ispu24 = air?.ispu24h?.value ?? null;
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Animate needle to value
  useEffect(() => {
    if (ispuNow == null) return;
    const target = ispuNow;
    const start = displayed;
    const startTime = performance.now();
    const dur = 1200;
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(start + (target - start) * ease));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ispuNow]);

  if (ispuNow == null && ispu24 == null) return null;

  const needleAngle = ispuToAngle(displayed);
  const needle24Angle = ispu24 != null ? ispuToAngle(ispu24) : null;

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Gauge ISPU</p>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-slate-800 inline-block rounded" /> Sekarang
          </span>
          {ispu24 != null && (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-slate-400 inline-block rounded border-dashed" /> 24 jam
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px]" aria-label={`ISPU gauge: ${ispuNow}`}>
          {/* Segments */}
          {SEGMENTS.map((seg, i) => {
            const startAngle = -90 + (seg.lo / 500) * 180;
            const endAngle = -90 + (seg.hi / 500) * 180;
            const gap = i < SEGMENTS.length - 1 ? 0.8 : 0;
            return (
              <path
                key={seg.lo}
                d={arcPath(CX, CY, R_INNER, R_OUTER, startAngle, endAngle - gap)}
                fill={seg.color}
                opacity={0.85}
              />
            );
          })}

          {/* 24h average marker (thin line) */}
          {needle24Angle != null && (() => {
            const inner = polarXY(CX, CY, R_INNER - 4, needle24Angle);
            const outer = polarXY(CX, CY, R_OUTER + 4, needle24Angle);
            return (
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke="#64748b" strokeWidth={2} strokeDasharray="3 2" />
            );
          })()}

          {/* Main needle */}
          <Needle angleDeg={needleAngle} />

          {/* Scale labels */}
          {[0, 100, 200, 300, 500].map(v => {
            const a = ispuToAngle(v);
            const p = polarXY(CX, CY, R_OUTER + 14, a);
            return (
              <text key={v} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fill="#94a3b8" fontWeight="600">
                {v}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">ISPU per jam</p>
          <p className="text-3xl font-black tabular-nums" style={{ color: air?.ispuNow?.color ?? "#94a3b8" }}>
            {ispuNow ?? "—"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{air?.ispuNow?.label ?? ""}</p>
          <p className="text-[10px] text-slate-300 mt-0.5">indikatif per jam</p>
        </div>
        {ispu24 != null && (
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Rata-rata 24 jam</p>
            <p className="text-3xl font-black tabular-nums" style={{ color: air?.ispu24h?.color ?? "#94a3b8" }}>
              {ispu24}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{air?.ispu24h?.label ?? ""}</p>
            <p className="text-[10px] text-slate-300 mt-0.5">dasar keputusan resmi</p>
          </div>
        )}
      </div>

      {/* Segment colour guide */}
      <div className="flex gap-1 justify-between flex-wrap">
        {SEGMENTS.map(s => (
          <div key={s.lo} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[9px] text-slate-400">{s.lo}–{s.hi}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-300">
        Warna segmen: KLHK ISPU resmi (Permen LHK P.14/2020).
        Jarum = ISPU per jam indikatif. Garis putus = ISPU 24-jam.
      </p>
    </div>
  );
}
