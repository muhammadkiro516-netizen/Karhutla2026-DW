# 03 Tab Udara — Design

Components (`src/components/udara/`): `AirHero`, `MetricPills`, `TodayAdvice`, `TomorrowCard`, `SmokeHint`, `IspuChart` (dynamic import, `ssr:false`), `OtherCities`, `ReadAloud`.
Data: `useAir()` (find selected city), `useWeather()`, `useHotspots()` (only `threat` for SmokeHint; fetch lazily after hero renders).
Desktop: hero + advice left; chart + other cities in context panel.
Wind arrow: rotate `downwindDeg(windFromDeg)`; text uses `compassName(windFromDeg)` ("dari timur laut").
Chart: Recharts `ComposedChart`; `ReferenceArea` bands at 0–50/51–100/101–200/201–300/301+ with 12% opacity of ISPU colours; two `Line`s (past solid, forecast `strokeDasharray="4 4"`) split on `forecast` flag; `ReferenceLine` x=now.
SmokeHint rule implemented as pure `smokeHint(threat, nearestClusterKm, pm25Last6h)` in `src/lib/attribution.ts` with 3 Vitest cases.
