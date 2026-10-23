"use client";
/**
 * WindCompass — animated SVG compass showing wind direction + speed ring.
 * Wind direction is meteorological "from" bearing (0° = from north).
 * The arrow points in the "to" direction (downwind).
 */
import { useMemo } from "react";
import { compassName } from "@/lib/geo";
import type { WeatherCity } from "@/types/api";

const SIZE = 180;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 78;
const R_TICK = 72;
const R_INNER = 58;

const DIRS = ["U", "TL", "T", "TG", "S", "BD", "B", "BL"] as const;
// Bearing 0=N, 45=NE, ... displayed in Indonesian
const DIR_BEARINGS = [0, 45, 90, 135, 180, 225, 270, 315];

function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

interface WindCompassProps {
  weather: WeatherCity | undefined;
}

export function WindCompass({ weather }: WindCompassProps) {
  const windFromDeg = weather?.windFromDeg ?? null;
  const windKmh = weather?.windKmh ?? null;
  const rh = weather?.rh ?? null;
  const temp = weather?.temp ?? null;

  // Arrow points downwind (from + 180)
  const arrowDeg = windFromDeg != null ? (windFromDeg + 180) % 360 : null;

  // Speed ring: 0 km/h = 0 fill, 60 km/h = full circumference
  const maxSpeed = 60;
  const speedFraction = windKmh != null ? Math.min(windKmh / maxSpeed, 1) : 0;
  const circumference = 2 * Math.PI * R_OUTER;
  const dashOffset = circumference * (1 - speedFraction);

  const arrowTip = useMemo(() => {
    if (arrowDeg == null) return null;
    return polarXY(CX, CY, R_INNER - 6, arrowDeg);
  }, [arrowDeg]);

  const arrowBase1 = useMemo(() => {
    if (arrowDeg == null) return null;
    return polarXY(CX, CY, 14, arrowDeg + 135);
  }, [arrowDeg]);

  const arrowBase2 = useMemo(() => {
    if (arrowDeg == null) return null;
    return polarXY(CX, CY, 14, arrowDeg - 135);
  }, [arrowDeg]);

  const windLabel = windFromDeg != null ? compassName(windFromDeg) : null;

  // Beaufort scale label
  const beaufort = windKmh == null ? null
    : windKmh < 1 ? "Tenang"
    : windKmh < 6 ? "Angin sepoi"
    : windKmh < 12 ? "Angin lemah"
    : windKmh < 20 ? "Angin sedang"
    : windKmh < 29 ? "Angin agak kencang"
    : windKmh < 39 ? "Angin kencang"
    : "Angin sangat kencang";

  // Wind speed ring colour
  const ringColor = windKmh == null ? "#e2e8f0"
    : windKmh < 12 ? "#22c55e"
    : windKmh < 25 ? "#f59e0b"
    : "#ef4444";

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Angin &amp; Cuaca</p>

      <div className="flex items-center gap-4">
        {/* SVG Compass */}
        <div className="flex-shrink-0">
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-label="Kompas angin">
            {/* Outer track */}
            <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#f1f5f9" strokeWidth={6} />
            {/* Speed ring */}
            <circle
              cx={CX} cy={CY} r={R_OUTER}
              fill="none" stroke={ringColor} strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${CX} ${CY})`}
              style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
            />
            {/* Inner circle */}
            <circle cx={CX} cy={CY} r={R_INNER} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1} />

            {/* Cardinal tick marks */}
            {DIR_BEARINGS.map((b, i) => {
              const outer = polarXY(CX, CY, R_TICK, b);
              const inner = polarXY(CX, CY, R_TICK - (i % 2 === 0 ? 7 : 4), b);
              const label = polarXY(CX, CY, R_TICK + 10, b);
              return (
                <g key={b}>
                  <line x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y}
                    stroke={i % 2 === 0 ? "#94a3b8" : "#cbd5e1"} strokeWidth={i % 2 === 0 ? 2 : 1} />
                  {i % 2 === 0 && (
                    <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle"
                      fontSize={9} fontWeight="700" fill="#94a3b8">
                      {DIRS[i]}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Wind arrow */}
            {arrowTip && arrowBase1 && arrowBase2 && (
              <g style={{ transition: "transform 0.8s ease" }}>
                <polygon
                  points={`${arrowTip.x},${arrowTip.y} ${arrowBase1.x},${arrowBase1.y} ${arrowBase2.x},${arrowBase2.y}`}
                  fill="#3b82f6" opacity={0.9}
                />
                {/* Tail dot */}
                <circle cx={CX} cy={CY} r={4} fill="#3b82f6" />
              </g>
            )}

            {/* Centre: speed */}
            {windKmh != null && (
              <>
                <text x={CX} y={CY - 6} textAnchor="middle" fontSize={18} fontWeight="900" fill="#1e293b">
                  {Math.round(windKmh)}
                </text>
                <text x={CX} y={CY + 10} textAnchor="middle" fontSize={9} fontWeight="600" fill="#94a3b8">
                  km/jam
                </text>
              </>
            )}
            {windKmh == null && (
              <text x={CX} y={CY + 4} textAnchor="middle" fontSize={12} fill="#cbd5e1">—</text>
            )}
          </svg>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {windLabel && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Arah angin dari</p>
              <p className="text-base font-black text-slate-800 capitalize">{windLabel}</p>
              {beaufort && <p className="text-xs text-slate-400">{beaufort}</p>}
            </div>
          )}
          {temp != null && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Suhu</p>
              <p className="text-base font-black text-slate-800">{Math.round(temp)}°C</p>
            </div>
          )}
          {rh != null && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Kelembaban</p>
              <p className="text-base font-black text-slate-800">{Math.round(rh)}%</p>
              <p className="text-[10px] text-slate-400">
                {rh < 40 ? "Kering — debu mudah beterbangan"
                : rh < 70 ? "Normal"
                : "Lembab — sedikit menekan debu"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Smoke direction implication */}
      {windFromDeg != null && windKmh != null && windKmh >= 2 && (
        <div className="rounded-2xl bg-blue-50 border border-blue-100 px-3 py-2.5">
          <p className="text-xs font-semibold text-blue-700">
            Asap bergerak ke arah {compassName((windFromDeg + 180) % 360)}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Angin dari {windLabel} artinya asap terbawa ke arah sebaliknya.
            {windKmh < 10 ? " Kecepatan rendah — asap bisa menumpuk di sekitar sumber." : ""}
            {windKmh >= 25 ? " Kecepatan tinggi — asap menyebar lebih cepat tapi juga lebih jauh." : ""}
          </p>
        </div>
      )}

      {/* Wind history (sparkline from hourly) */}
      {(weather?.hourlyWind?.length ?? 0) > 0 && (
        <WindSpeedSparkline hourly={weather!.hourlyWind.slice(-24)} />
      )}

      <p className="text-[10px] text-slate-300">Sumber: Open-Meteo · Arah = dari mana angin datang</p>
    </div>
  );
}

/* ── Mini sparkline of wind speed last 24h ── */
function WindSpeedSparkline({ hourly }: { hourly: { time: string; windKmh: number }[] }) {
  if (!hourly.length) return null;
  const maxV = Math.max(...hourly.map(h => h.windKmh), 10);
  const W = 240;
  const H = 40;
  const pts = hourly.map((h, i) => {
    const x = (i / (hourly.length - 1)) * W;
    const y = H - (h.windKmh / maxV) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
        Kecepatan angin 24 jam terakhir
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10" aria-label="Grafik kecepatan angin">
        <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeLinejoin="round" />
        {/* Max line */}
        <line x1={0} y1={2} x2={W} y2={2} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
      </svg>
      <div className="flex justify-between text-[9px] text-slate-300 mt-0.5">
        <span>{hourly[0]?.time.slice(11, 16)}</span>
        <span>{maxV.toFixed(0)} km/j maks</span>
        <span>{hourly[hourly.length - 1]?.time.slice(11, 16)}</span>
      </div>
    </div>
  );
}
