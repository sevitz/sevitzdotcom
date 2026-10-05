import data from "../data/stats.json";

export type Level = 0 | 1 | 2 | 3 | 4;
export type Week = { start: string; added: number; removed: number; loc: number };
export type WeekDelta = { added: number; removed: number };
export type RepoStat = {
  label: string;
  kind: "repo" | "retired";
  visibility?: "public" | "private";
  url?: string;
  /** GitHub page of a public repo, shown as an icon link. */
  github?: string;
  desc?: string;
  /** Latest commit to the repo (ISO, UTC); for a retired row, the latest of the group. */
  updated?: string;
  /** Number of repos folded into a "retired" row. */
  count?: number;
  commits: number;
  loc: number;
  weekly: WeekDelta[];
};
export type Day = { date: string; count: number; level: Level };
export type Stats = {
  generatedAt: string;
  totals: { repos: number; commits: number; loc: number };
  weeks: Week[];
  repos: RepoStat[];
  contributions: {
    total: number;
    repoCount: number;
    breakdown: { commits: number; pullRequests: number; issues: number; reviews: number };
    calendar: Day[];
  };
};

export const stats = data as Stats;

export const DESC_LIMIT = 28;

export const formatNumber = (n: number) => n.toLocaleString("en-GB");

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Clips on a word boundary so a collapsed row stays one line; text at or under the limit is returned as-is. */
export function clipDescription(text: string, limit = DESC_LIMIT): { short: string; clipped: boolean } {
  const t = text.trim();
  if (t.length <= limit) return { short: t, clipped: false };
  const cut = t.slice(0, limit + 1);
  const atWord = cut.replace(/\s+\S*$/, "");
  const short = (atWord.length >= Math.floor(limit / 2) ? atWord : t.slice(0, limit)).trimEnd();
  return { short: short.replace(/[.,;:\s]+$/, ""), clipped: true };
}
