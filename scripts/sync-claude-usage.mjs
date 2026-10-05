// Copies the Claude usage file from the private claude-library repo into src/data/claude-usage.json,
// but only if it passes a strict shape check. Nothing but dates, model ids and four counters can get
// through, so a path, project name or prompt in a bad file can never reach the public repo.
//
// A missing or invalid file never fails the run (exit 0, site data untouched), so the GitHub stats
// refresh in the same workflow is never blocked by it. Only counts and reason codes are logged.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COUNTERS = ["in", "out", "cw", "cr"];
const isPlain = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const sameKeys = (obj, keys) => Object.keys(obj).length === keys.length && keys.every((k) => k in obj);
const isRealDate = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const t = Date.parse(`${s}T00:00:00Z`);
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === s;
};

/** Returns { ok: true } or { ok: false, reason } where reason is a fixed code, never file content. */
export function validate(data) {
  if (!isPlain(data) || !sameKeys(data, ["generatedAt", "days"])) return { ok: false, reason: "top-level keys" };
  if (typeof data.generatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(data.generatedAt)) return { ok: false, reason: "generatedAt" };
  if (!Array.isArray(data.days) || data.days.length > 5000) return { ok: false, reason: "days" };
  let previous = "";
  for (const day of data.days) {
    if (!isPlain(day) || !sameKeys(day, ["date", "models"])) return { ok: false, reason: "day keys" };
    if (typeof day.date !== "string" || !isRealDate(day.date)) return { ok: false, reason: "date" };
    if (day.date <= previous) return { ok: false, reason: "date order" };
    previous = day.date;
    if (!isPlain(day.models) || Object.keys(day.models).length > 50) return { ok: false, reason: "models" };
    for (const [id, counts] of Object.entries(day.models)) {
      if (id.length > 60 || !/^claude-[a-z0-9.-]+$/.test(id)) return { ok: false, reason: "model id" };
      if (!isPlain(counts) || !sameKeys(counts, COUNTERS)) return { ok: false, reason: "counter keys" };
      if (!COUNTERS.every((k) => Number.isSafeInteger(counts[k]) && counts[k] >= 0)) return { ok: false, reason: "counter value" };
    }
  }
  return { ok: true };
}

const stable = (o) => JSON.stringify({ ...o, generatedAt: "" });

function main() {
  const args = process.argv.slice(2);
  const from = args.includes("--from") ? args[args.indexOf("--from") + 1] : undefined;
  const to = path.resolve(args.includes("--to") ? args[args.indexOf("--to") + 1] : path.join(ROOT, "src/data/claude-usage.json"));
  const warn = (msg) => console.log(process.env.GITHUB_ACTIONS ? `::warning::${msg}` : msg);

  if (!from || !existsSync(from)) return warn("claude usage sync: no source file, skipped");
  let data;
  try {
    data = JSON.parse(readFileSync(from, "utf8"));
  } catch {
    return warn("claude usage sync: source is not valid JSON, skipped");
  }
  let result;
  try {
    result = validate(data);
  } catch {
    result = { ok: false, reason: "unexpected" };
  }
  if (!result.ok) return warn(`claude usage sync: source rejected (${result.reason}), site data untouched`);

  let previous = null;
  try {
    previous = existsSync(to) ? JSON.parse(readFileSync(to, "utf8")) : null;
  } catch {
    previous = null;
  }
  if (previous && stable(previous) === stable(data)) return console.log(`claude usage sync: no changes (${data.days.length} days)`);

  writeFileSync(to, JSON.stringify(data, null, 2) + "\n");
  console.log(`claude usage sync: wrote ${data.days.length} days`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
