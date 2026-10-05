import data from "../data/claude-usage.json";

export { formatTokens, niceScale } from "./tokens";

export type Counters = { in: number; out: number; cw: number; cr: number };
export type UsageDay = { date: string; models: Record<string, Counters> };
export type ClaudeUsage = { generatedAt: string; days: UsageDay[] };

export const usage = data as unknown as ClaudeUsage;

export type ModelRow = { id: string; name: string; in: number; out: number; total: number; share: number; color: number };
export type UsageView = {
  key: "all" | "30" | "7";
  label: string;
  days: UsageDay[];
  rows: ModelRow[];
  /** Model ids stacked bottom to top, matching the colour order. */
  stack: string[];
  total: number;
  activeDays: number;
};

const DAY = 864e5;
const MAX_NAMED = 6;

export const dayTotal = (models: Record<string, Counters>) =>
  Object.values(models).reduce((n, c) => n + c.in + c.out + c.cw + c.cr, 0);
const countersTotal = (c: Counters) => c.in + c.out + c.cw + c.cr;

/** `claude-opus-5-5` -> "Opus 5.5", `claude-haiku-4-5-20251001` -> "Haiku 4.5"; anything else stays as the raw id. */
export function modelName(id: string): string {
  const m = /^claude-(opus|sonnet|haiku)-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?$/.exec(id);
  if (!m) return id;
  const family = m[1][0].toUpperCase() + m[1].slice(1);
  return `${family} ${m[2]}${m[3] ? `.${m[3]}` : ""}`;
}

const toTime = (date: string) => Date.parse(`${date}T00:00:00Z`);
const toDate = (t: number) => new Date(t).toISOString().slice(0, 10);

/** Calendar days ending on the last day with data, empty days included. `n` null means since the first day. */
export function windowDays(days: UsageDay[], n: number | null): UsageDay[] {
  if (days.length === 0) return [];
  const last = toTime(days[days.length - 1].date);
  const start = n === null ? toTime(days[0].date) : last - (n - 1) * DAY;
  const byDate = new Map(days.map((d) => [d.date, d]));
  const out: UsageDay[] = [];
  for (let t = start; t <= last; t += DAY) {
    const date = toDate(t);
    out.push(byDate.get(date) ?? { date, models: {} });
  }
  return out;
}

/** Colour order comes from all-time totals so a model keeps its colour in every range. */
export function colorOrder(days: UsageDay[]): string[] {
  const totals = new Map<string, number>();
  for (const d of days) for (const [id, c] of Object.entries(d.models)) totals.set(id, (totals.get(id) ?? 0) + countersTotal(c));
  return [...totals.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([id]) => id);
}

export function buildView(all: UsageDay[], key: UsageView["key"]): UsageView {
  const n = key === "all" ? null : Number(key);
  const days = windowDays(all, n);
  const order = colorOrder(all);
  const named = order.slice(0, MAX_NAMED);
  const bucket = (id: string) => (named.includes(id) ? id : "other");

  const sums = new Map<string, Counters>();
  for (const d of days) {
    for (const [id, c] of Object.entries(d.models)) {
      const b = bucket(id);
      const cur = sums.get(b) ?? { in: 0, out: 0, cw: 0, cr: 0 };
      cur.in += c.in;
      cur.out += c.out;
      cur.cw += c.cw;
      cur.cr += c.cr;
      sums.set(b, cur);
    }
  }
  const total = [...sums.values()].reduce((s, c) => s + countersTotal(c), 0);
  const stack = [...named, ...(order.length > MAX_NAMED ? ["other"] : [])];
  const rows = stack
    .filter((id) => sums.has(id))
    .map((id): ModelRow => {
      const c = sums.get(id)!;
      return {
        id,
        name: id === "other" ? "Other" : modelName(id),
        in: c.in,
        out: c.out,
        total: countersTotal(c),
        share: total > 0 ? (countersTotal(c) / total) * 100 : 0,
        color: stack.indexOf(id),
      };
    })
    .sort((a, b) => b.total - a.total);

  return {
    key,
    label: key === "all" ? "All" : `${key}d`,
    days,
    rows,
    stack,
    total,
    activeDays: days.filter((d) => dayTotal(d.models) > 0).length,
  };
}

/** One day's tokens per stack slot (same order as `stack`); models outside the named set go to "other". */
export function dayBuckets(day: UsageDay, stack: string[]): number[] {
  const named = new Set(stack.filter((s) => s !== "other"));
  const sums = stack.map(() => 0);
  for (const [id, c] of Object.entries(day.models)) {
    const idx = stack.indexOf(named.has(id) ? id : "other");
    if (idx >= 0) sums[idx] += countersTotal(c);
  }
  return sums;
}

export const formatShortDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
