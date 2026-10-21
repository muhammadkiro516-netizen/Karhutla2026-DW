/**
 * Backtest: replay historical PM2.5 data through the school-status engine.
 * Usage: npx tsx scripts/backtest.ts --city jambi --from 2023-09-01 --to 2023-10-31
 * Output: CSV to stdout or --out <file>
 */

import { writeFileSync } from "fs";
import { toIspuSeries, ispu24h } from "../src/lib/ispu";
import { deriveStatusTimeline, rulesFor } from "../src/lib/school-status";
import { CITIES, getCity } from "../src/config/cities";
import type { HourlyPoint } from "../src/types/domain";

// Parse CLI args
const args = process.argv.slice(2);
const get = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };

const cityArg = get("--city") ?? "jambi";
const fromArg = get("--from") ?? "2023-09-01";
const toArg = get("--to") ?? "2023-10-31";
const outArg = get("--out");

const city = getCity(cityArg);
if (!city) {
  const ids = CITIES.map(c => c.id).join(", ");
  console.error(`Unknown city: "${cityArg}". Available: ${ids}`);
  process.exit(1);
}

const fromDate = new Date(fromArg + "T00:00:00Z");
const toDate = new Date(toArg + "T23:59:59Z");
if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
  console.error("Invalid date format. Use YYYY-MM-DD.");
  process.exit(1);
}

const pastDays = Math.ceil((Date.now() - fromDate.getTime()) / 86400000);
const forecastDays = 1;

console.error(`Fetching ${city.name} data from ${fromArg} to ${toArg}…`);

const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&hourly=pm2_5&past_days=${pastDays}&forecast_days=${forecastDays}&timezone=${encodeURIComponent(city.tz)}`;

interface OpenMeteoResponse {
  hourly?: { time?: string[]; pm2_5?: (number | null)[] };
  error?: boolean;
  reason?: string;
}

fetch(url)
  .then(r => r.json() as Promise<OpenMeteoResponse>)
  .then(data => {
    if (data.error) {
      console.error(`Open-Meteo error: ${data.reason ?? "unknown"}`);
      process.exit(0);
    }

    const times = data.hourly?.time ?? [];
    const pm25Raw = data.hourly?.pm2_5 ?? [];

    if (times.length === 0) {
      console.error("No data returned for this period/location. Open-Meteo may not have historical data here.");
      process.exit(0);
    }

    // Filter to requested date range
    const points: HourlyPoint[] = times
      .map((t, i) => ({ time: t, value: pm25Raw[i] ?? null }))
      .filter(p => {
        const d = new Date(p.time);
        return d >= fromDate && d <= toDate;
      });

    if (points.length === 0) {
      console.error(`No data in range ${fromArg}–${toArg} for ${city.name}.`);
      process.exit(0);
    }

    const ispuSeries = toIspuSeries(points);
    const statusNormal = deriveStatusTimeline(ispuSeries.map(p => p.value), rulesFor(false));
    const statusVulnerable = deriveStatusTimeline(ispuSeries.map(p => p.value), rulesFor(true));
    const ispu24hSeries = (() => {
      const results: (number | null)[] = [];
      for (let i = 0; i < points.length; i++) {
        const window = points.slice(Math.max(0, i - 23), i + 1);
        const r = ispu24h(window);
        results.push(r?.value ?? null);
      }
      return results;
    })();

    const rows = [
      "time,pm25,ispu_now,ispu_24h,status_normal,status_vulnerable",
      ...points.map((p, i) => [
        p.time,
        p.value ?? "",
        ispuSeries[i]?.value ?? "",
        ispu24hSeries[i] ?? "",
        statusNormal[i]?.code ?? "",
        statusVulnerable[i]?.code ?? "",
      ].join(",")),
    ].join("\n");

    if (outArg) {
      writeFileSync(outArg, rows);
      console.error(`Written ${points.length} rows to ${outArg}`);
    } else {
      process.stdout.write(rows + "\n");
      console.error(`${points.length} rows for ${city.name} (${fromArg} to ${toArg})`);
    }
  })
  .catch(err => {
    console.error("Fetch failed:", err instanceof Error ? err.message : String(err));
    process.exit(0);
  });
