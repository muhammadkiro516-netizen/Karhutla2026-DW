import { SCHOOL_RULES } from "@/config/thresholds";
import type { HourlyPoint, SchoolLevel, SchoolStatus } from "@/types/domain";

const CODES = ["NORMAL", "WASPADA", "HYBRID", "DARING_DARURAT"] as const;
const LABELS = ["Normal", "Waspada", "Hybrid", "Daring Darurat"] as const;

export interface RuleSet { thr: [number, number, number, number]; hours: [number, number, number, number]; hysteresis: number }

export function rulesFor(vulnerable = false, rules = SCHOOL_RULES): RuleSet {
  const off = vulnerable ? rules.vulnerableOffset : 0;
  return {
    thr: [Infinity, rules.waspada.above - off, rules.hybrid.above - off, rules.daring.above - off],
    hours: [0, rules.waspada.hours, rules.hybrid.hours, rules.daring.hours],
    hysteresis: rules.hysteresisHours,
  };
}

export function statusOf(level: SchoolLevel, reason: string): SchoolStatus {
  return { level, code: CODES[level], label: LABELS[level], reason };
}

/**
 * Replays an hourly ISPU series (oldest -> newest) and returns the status after each hour.
 * Deterministic & stateless: no stored "previous status" needed, so server and client agree.
 * - Escalate immediately when a level's duration rule is met.
 * - Step down only after `hysteresis` consecutive valid hours at/below the CURRENT level threshold.
 * - null (missing data) never escalates and never counts toward stepping down.
 */
export function deriveStatusTimeline(series: (number | null)[], rs: RuleSet = rulesFor()): SchoolStatus[] {
  const above = [0, 0, 0, 0];
  let level: SchoolLevel = 0;
  let below = 0;
  const out: SchoolStatus[] = [];

  for (const v of series) {
    for (let L = 1; L <= 3; L++) above[L] = v != null && v > rs.thr[L] ? above[L] + 1 : 0;
    let target: SchoolLevel = 0;
    for (let L = 3 as SchoolLevel; L >= 1; L--) {
      if (above[L] >= rs.hours[L]) { target = L; break; }
    }

    if (target > level) {
      level = target;
      below = 0;
    } else if (level > 0 && v != null) {
      below = v <= rs.thr[level] ? below + 1 : 0;
      if (below >= rs.hysteresis) {
        level = target;
        below = 0;
      }
    }
    out.push(statusOf(level, explain(level, v, rs, above, below)));
  }
  return out;
}

function explain(level: SchoolLevel, v: number | null, rs: RuleSet, above: number[], below: number): string {
  const now = v == null ? "data jam ini kosong" : `ISPU jam ini ${v}`;
  if (level === 0) return `${now}; di bawah ambang Waspada (>${rs.thr[1]}).`;
  const streak = above[level] >= rs.hours[level]
    ? `di atas ${rs.thr[level]} selama ${above[level]} jam berturut-turut`
    : `belum ${rs.hysteresis} jam berturut-turut di bawah ${rs.thr[level]} (baru ${below} jam), status ditahan`;
  return `${now}; ${streak}.`;
}

export function evaluateSchoolStatus(series: (number | null)[], vulnerable = false): SchoolStatus {
  const tl = deriveStatusTimeline(series, rulesFor(vulnerable));
  return tl[tl.length - 1] ?? statusOf(0, "Belum ada data.");
}

/**
 * Forecast-based recommendation for a school day (e.g. tomorrow), from hourly ISPU forecast
 * with local ISO times "YYYY-MM-DDTHH:mm". Streaks are built from 00:00 so a smoky night counts.
 */
export function forecastSchoolDay(points: HourlyPoint[], date: string, vulnerable = false, rules = SCHOOL_RULES) {
  const day = points.filter((p) => p.time.startsWith(date));
  if (day.length === 0) return null;
  const tl = deriveStatusTimeline(day.map((p) => p.value), rulesFor(vulnerable, rules));
  let worst: SchoolStatus = statusOf(0, "Prakiraan jam sekolah di bawah ambang.");
  let peak: number | null = null;
  day.forEach((p, i) => {
    const hour = Number(p.time.slice(11, 13));
    if (hour < rules.schoolHours.start || hour > rules.schoolHours.end) return;
    if (p.value != null) peak = Math.max(peak ?? 0, p.value);
    if (tl[i].level > worst.level) worst = tl[i];
  });
  return { status: worst, peakIspu: peak, window: `${String(rules.schoolHours.start).padStart(2, "0")}.00–${String(rules.schoolHours.end).padStart(2, "0")}.00` };
}
