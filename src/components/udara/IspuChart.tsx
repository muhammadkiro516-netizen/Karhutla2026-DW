"use client";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ISPU_META } from "@/lib/ispu";
import type { AirHourly } from "@/types/api";

interface IspuChartProps {
  hourly: AirHourly[];
  tzLabel: string;
}

const BANDS = [
  { y1: 0, y2: 50, color: ISPU_META.BAIK.color },
  { y1: 51, y2: 100, color: ISPU_META.SEDANG.color },
  { y1: 101, y2: 200, color: ISPU_META.TIDAK_SEHAT.color },
  { y1: 201, y2: 300, color: ISPU_META.SANGAT_TIDAK_SEHAT.color },
  { y1: 301, y2: 500, color: ISPU_META.BERBAHAYA.color },
];

export function IspuChart({ hourly, tzLabel }: IspuChartProps) {
  const nowStr = new Date().toISOString().slice(0, 16);

  const data = hourly.map((h) => ({
    time: h.time.slice(11, 16), // "HH:mm"
    ispuPast: h.forecast ? null : h.ispu,
    ispuForecast: h.forecast ? h.ispu : null,
    rawTime: h.time,
  }));

  const nowIdx = hourly.findIndex((h) => h.time.slice(0, 16) >= nowStr);
  const nowLabel = nowIdx >= 0 ? data[nowIdx]?.time : undefined;

  return (
    <div className="w-full h-52">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          {BANDS.map((b) => (
            <ReferenceArea
              key={b.y1}
              y1={b.y1}
              y2={b.y2}
              fill={b.color}
              fillOpacity={0.12}
            />
          ))}
          {nowLabel && (
            <ReferenceLine
              x={nowLabel}
              stroke="#374151"
              strokeDasharray="4 2"
              label={{ value: "kini", fill: "#374151", fontSize: 10 }}
            />
          )}
          <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
          <YAxis domain={[0, "auto"]} tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(value) => [
              value != null ? `ISPU ${value}` : "—",
              "",
            ]}
            labelFormatter={(label) => `${label} ${tzLabel}`}
          />
          <Line
            dataKey="ispuPast"
            stroke="#374151"
            strokeWidth={2}
            dot={false}
            name="Terukur"
            connectNulls
          />
          <Line
            dataKey="ispuForecast"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            name="Prakiraan"
            connectNulls
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
