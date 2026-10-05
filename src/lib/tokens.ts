// Pure helpers shared by the server-rendered chart and the browser script that re-draws it.
// Keep this file free of data imports so the client bundle stays tiny.

/** 23800 -> "23.8k", 7.8e6 -> "7.8M", 859000 -> "859k", 825 -> "825". */
export function formatTokens(n: number): string {
  const trim = (v: number, unit: string) => `${Number(v.toPrecision(3))}${unit}`;
  if (n >= 999.5e6) return trim(n / 1e9, "B");
  if (n >= 999.5e3) return trim(n / 1e6, "M");
  if (n >= 1e3) return trim(n / 1e3, "k");
  return String(Math.round(n));
}

/** A y-axis maximum with four even steps that reaches `max`. */
export function niceScale(max: number): { max: number; step: number } {
  const rough = Math.max(max, 1) / 4;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((f) => f * pow).find((s) => s >= rough) ?? 10 * pow;
  return { max: step * 4, step };
}
