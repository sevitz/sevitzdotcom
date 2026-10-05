// Builds src/data/stats.json from the GitHub repos listed in a private config.
// Run by .github/workflows/stats.yml, or locally with `npm run stats`.
//
// Privacy: this repo (and its Action logs) are public. Only repos approved in the
// config are counted or shown, and the output is scanned for the real names of any
// repo that must stay hidden before it is written. Nothing but counts is logged
// outside `--check`.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DAY = 864e5;
const IN_CI = Boolean(process.env.GITHUB_ACTIONS);

const EXCLUDES = [
  "*package-lock.json",
  "*pnpm-lock.yaml",
  "*yarn.lock",
  "*.lock",
  "*.lockb",
  "*.min.js",
  "*.min.css",
  "*.map",
  "*.svg",
  "dist/*",
  "*/dist/*",
  "node_modules/*",
  "*/node_modules/*",
];

const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const log = (msg) => console.log(msg);
const fail = (msg) => {
  console.error(`stats: ${msg}`);
  process.exit(1);
};

// ---------- pure helpers (exported for tests) ----------

export function mondayOf(date) {
  const t = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dow = (new Date(t).getUTCDay() + 6) % 7;
  return new Date(t - dow * DAY).toISOString().slice(0, 10);
}

/** Parses `git log --numstat --format=%x00%aI` output into [{date, added, removed}] per commit. */
export function parseNumstat(output) {
  const commits = [];
  for (const chunk of output.split("\0")) {
    if (!chunk.trim()) continue;
    const [dateLine, ...rest] = chunk.split("\n");
    let added = 0;
    let removed = 0;
    for (const line of rest) {
      const [a, r] = line.split("\t");
      if (!/^\d+$/.test(a ?? "") || !/^\d+$/.test(r ?? "")) continue;
      added += Number(a);
      removed += Number(r);
    }
    commits.push({ date: new Date(dateLine.trim()), added, removed });
  }
  return commits;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Returns the forbidden names found in `text` (case-insensitive, whole-token match). */
export function findLeaks(text, forbidden) {
  const hits = [];
  for (const name of forbidden) {
    if (!name) continue;
    const re = new RegExp(`(?<![A-Za-z0-9_.-])${escapeRe(name)}(?![A-Za-z0-9_-])`, "i");
    if (re.test(text)) hits.push(name);
  }
  return hits;
}

export function cleanDescription(text) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

export function cleanUrl(value) {
  const raw = (value ?? "").trim();
  if (!raw) return undefined;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href.replace(/\/$/, "") : undefined;
  } catch {
    return undefined;
  }
}

export function validateConfig(config) {
  if (!config || !Array.isArray(config.repos)) throw new Error("config needs a `repos` array");
  if (config.chartStart !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(config.chartStart)) throw new Error("`chartStart` must look like 2026-06-01");
  const seen = new Set();
  for (const r of config.repos) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(r.repo ?? "")) throw new Error("each repo entry needs an owner/name `repo`");
    if (!["name", "codename", "retired"].includes(r.show)) throw new Error("each repo entry needs `show`: name, codename or retired");
    if (r.show === "codename" && !r.label?.trim()) throw new Error("a codename entry needs a `label`");
    if (seen.has(r.repo.toLowerCase())) throw new Error("a repo is listed twice");
    seen.add(r.repo.toLowerCase());
  }
  for (const r of config.ignore ?? []) {
    if (seen.has(r.repo?.toLowerCase())) throw new Error("a repo is both approved and ignored");
  }
}

// ---------- GitHub ----------

function getToken() {
  const env = process.env.STATS_GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (env) return env;
  const r = spawnSync("gh", ["auth", "token"], { encoding: "utf8" });
  if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  fail("no token: set STATS_GITHUB_TOKEN or run `gh auth login`");
}

async function api(token, route, init = {}) {
  const res = await fetch(`https://api.github.com${route}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "sevitzdotcom-stats",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) fail(`GitHub API ${init.method ?? "GET"} ${route.split("?")[0].replace(/\/repos\/[^/]+\/[^/]+/, "/repos/…")} returned ${res.status}`);
  return res.json();
}

async function listOwnedRepos(token) {
  const all = [];
  for (let page = 1; ; page++) {
    const batch = await api(token, `/user/repos?affiliation=owner&per_page=100&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) return all;
  }
}

const CONTRIB_QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      totalRepositoryContributions
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } }
      commitContributionsByRepository(maxRepositories: 100) { repository { nameWithOwner } }
      issueContributionsByRepository(maxRepositories: 100) { repository { nameWithOwner } }
      pullRequestContributionsByRepository(maxRepositories: 100) { repository { nameWithOwner } }
      pullRequestReviewContributionsByRepository(maxRepositories: 100) { repository { nameWithOwner } }
    }
  }
}`;

/** Counts search hits (private repos included) and the distinct repos they belong to. */
async function searchIssues(token, q) {
  let total = 0;
  const repos = new Set();
  for (let page = 1; page <= 10; page++) {
    const res = await api(token, `/search/issues?q=${encodeURIComponent(q)}&per_page=100&page=${page}`);
    total = res.total_count;
    for (const item of res.items) repos.add(item.repository_url.replace("https://api.github.com/repos/", "").toLowerCase());
    if (res.items.length < 100) break;
  }
  return { total, repos };
}

// GitHub reports contributions to private repos only as one lump (restrictedContributionsCount), so the
// per-type split cannot come from GraphQL. Pull requests, issues and reviews come from search (which can see
// private repos); commits are what is left of the calendar total, matching the profile's Activity overview.
async function fetchContributions(token, login, activeRepos) {
  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 364 * DAY);
  const since = from.toISOString().slice(0, 10);
  const data = await api(token, "/graphql", {
    method: "POST",
    body: JSON.stringify({ query: CONTRIB_QUERY, variables: { login, from: from.toISOString(), to: now.toISOString() } }),
  });
  const c = data?.data?.user?.contributionsCollection;
  if (!c) fail("GitHub GraphQL returned no contributions (does the token allow reading the profile?)");
  const today = now.toISOString().slice(0, 10);
  const calendar = c.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .filter((d) => d.date <= today)
    .map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 }));
  const total = c.contributionCalendar.totalContributions;

  const prs = await searchIssues(token, `author:${login} type:pr created:>=${since}`);
  const issues = await searchIssues(token, `author:${login} type:issue created:>=${since}`);
  const reviewed = await searchIssues(token, `reviewed-by:${login} type:pr -author:${login} created:>=${since}`);

  const pullRequests = Math.max(prs.total, c.totalPullRequestContributions);
  const issueCount = Math.max(issues.total, c.totalIssueContributions);
  const reviews = Math.max(reviewed.total, c.totalPullRequestReviewContributions);
  const commits = Math.max(c.totalCommitContributions, total - pullRequests - issueCount - reviews - c.totalRepositoryContributions);

  const repos = new Set([
    ...[
      c.commitContributionsByRepository,
      c.issueContributionsByRepository,
      c.pullRequestContributionsByRepository,
      c.pullRequestReviewContributionsByRepository,
    ].flatMap((list) => list.map((x) => x.repository.nameWithOwner.toLowerCase())),
    ...prs.repos,
    ...issues.repos,
    ...reviewed.repos,
    ...activeRepos.map((r) => r.toLowerCase()),
  ]);

  const breakdown = { commits, pullRequests, issues: issueCount, reviews };
  if (!Object.values(breakdown).every(Number.isFinite)) fail("contribution breakdown could not be computed");
  return { total, repoCount: repos.size, breakdown, calendar };
}

// ---------- git ----------

function git(args, cwd) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 512 * 1024 * 1024, env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
  return r;
}

function cloneRepo(full, token, dest) {
  const header = `Authorization: basic ${Buffer.from(`x-access-token:${token}`).toString("base64")}`;
  const r = git(["-c", `http.extraheader=${header}`, "clone", "--quiet", "--no-tags", `https://github.com/${full}.git`, dest]);
  return r.status === 0;
}

function repoHistory(dir) {
  const hist = git(["log", "--no-merges", "--numstat", "--format=%x00%aI", "--", ".", ...EXCLUDES.map((p) => `:(exclude)${p}`)], dir);
  if (hist.status !== 0) return null;
  const count = git(["rev-list", "--count", "HEAD"], dir);
  if (count.status !== 0) return null;
  // Exact lines of text at HEAD. Per-commit numstat can drift slightly (merge conflict resolutions), so this anchors the series.
  const grep = git(["grep", "-I", "-c", "", "--", ".", ...EXCLUDES.map((p) => `:(exclude)${p}`)], dir);
  if (grep.status > 1) return null;
  const head = grep.stdout
    .split("\n")
    .filter(Boolean)
    .reduce((n, line) => n + Number(line.slice(line.lastIndexOf(":") + 1)), 0);
  return { commits: parseNumstat(hist.stdout), total: Number(count.stdout.trim()), head };
}

// ---------- main ----------

function loadConfig(args) {
  const i = args.indexOf("--config");
  const file = (i >= 0 ? args[i + 1] : undefined) ?? process.env.STATS_CONFIG_PATH;
  if (!file) fail("pass --config <path> (or set STATS_CONFIG_PATH)");
  if (!existsSync(file)) fail("config file not found");
  let config;
  try {
    config = JSON.parse(readFileSync(file, "utf8"));
    validateConfig(config);
  } catch (e) {
    fail(`bad config: ${e.message}`);
  }
  return config;
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const outIdx = args.indexOf("--out");
  const outPath = path.resolve(outIdx >= 0 ? args[outIdx + 1] : path.join(ROOT, "src/data/stats.json"));

  if (check && IN_CI) fail("--check prints repo names, so it only runs locally");

  const config = loadConfig(args);
  const token = getToken();
  const owned = await listOwnedRepos(token);
  const byName = new Map(owned.map((r) => [r.full_name.toLowerCase(), r]));

  const approved = new Set(config.repos.map((r) => r.repo.toLowerCase()));
  const ignored = new Map((config.ignore ?? []).map((r) => [r.repo.toLowerCase(), { repo: r.repo, reason: r.reason ?? "" }]));
  const unreviewed = owned.filter((r) => !r.fork && !r.archived && !approved.has(r.full_name.toLowerCase()) && !ignored.has(r.full_name.toLowerCase()));

  if (check) {
    log("Approved (what would be published):");
    for (const r of config.repos) {
      const gh = byName.get(r.repo.toLowerCase());
      if (!gh) {
        log(`  ${r.repo}: NOT FOUND`);
        continue;
      }
      const shown = r.show === "retired" ? "retired bucket" : r.show === "codename" ? `codename "${r.label}"` : "real name";
      log(`  ${r.repo} [${gh.private ? "private" : "public"}, ${shown}]`);
      if (r.show === "name") log(`      desc: ${cleanDescription(gh.description) || "(none)"}\n      site: ${cleanUrl(gh.homepage) ?? "(none)"}`);
    }
    log(`\nUnreviewed (excluded until you add them to the config): ${unreviewed.length}`);
    for (const r of unreviewed) log(`  ${r.full_name}`);
    log("\nCleanup candidates (ignored):");
    for (const { repo, reason } of ignored.values()) log(`  ${repo}${reason ? ` - ${reason}` : ""}`);
    return;
  }

  // Hide every name that must not appear publicly, even in logs.
  const hidden = [
    ...config.repos.filter((r) => r.show !== "name").map((r) => r.repo),
    ...[...ignored.values()].map((r) => r.repo),
    ...unreviewed.map((r) => r.full_name),
  ];
  if (IN_CI) for (const full of hidden) for (const v of [full, full.split("/")[1]]) console.log(`::add-mask::${v}`);

  const tmp = mkdtempSync(path.join(tmpdir(), "stats-"));
  const perRepo = [];
  try {
    for (const [i, entry] of config.repos.entries()) {
      const gh = byName.get(entry.repo.toLowerCase());
      if (!gh) fail(`approved repo ${i + 1}/${config.repos.length} was not found on GitHub`);
      const dest = path.join(tmp, String(i));
      if (!cloneRepo(gh.full_name, token, dest)) fail(`clone failed for repo ${i + 1}/${config.repos.length}`);
      const history = repoHistory(dest);
      if (!history) fail(`could not read history for repo ${i + 1}/${config.repos.length}`);
      rmSync(dest, { recursive: true, force: true });
      perRepo.push({ entry, gh, history });
      log(`repo ${i + 1}/${config.repos.length} ok`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }

  // Global weekly axis from the first commit to this week.
  const thisWeek = mondayOf(new Date());
  const allDates = perRepo.flatMap((r) => r.history.commits.map((c) => c.date)).filter((d) => !Number.isNaN(d.getTime()));
  const firstWeek = allDates.length > 0 ? mondayOf(new Date(Math.min(...allDates.map((d) => d.getTime())))) : thisWeek;
  const weekStarts = [];
  for (let t = Date.parse(firstWeek); t <= Date.parse(thisWeek); t += 7 * DAY) weekStarts.push(new Date(t).toISOString().slice(0, 10));
  const indexOf = new Map(weekStarts.map((w, i) => [w, i]));

  const series = perRepo.map(({ entry, gh, history }) => {
    const weekly = weekStarts.map(() => ({ added: 0, removed: 0 }));
    for (const c of history.commits) {
      if (Number.isNaN(c.date.getTime())) continue;
      const idx = Math.min(indexOf.get(mondayOf(c.date)) ?? weekStarts.length - 1, weekStarts.length - 1);
      weekly[idx].added += c.added;
      weekly[idx].removed += c.removed;
    }
    return { entry, gh, commits: history.total, loc: history.head, weekly };
  });

  const visible = series.filter((s) => s.entry.show !== "retired");
  const retired = series.filter((s) => s.entry.show === "retired");

  const repos = visible
    .map((s) => {
      const { entry, gh } = s;
      const isName = entry.show === "name";
      const url = isName ? cleanUrl(gh.homepage) ?? (gh.private ? undefined : gh.html_url) : cleanUrl(entry.website);
      const desc = cleanDescription(isName ? gh.description : entry.desc);
      return {
        label: isName ? gh.name : entry.label.trim(),
        kind: "repo",
        visibility: gh.private ? "private" : "public",
        url,
        desc: desc || undefined,
        commits: s.commits,
        loc: s.loc,
        weekly: s.weekly,
      };
    })
    .sort((a, b) => b.loc - a.loc || a.label.localeCompare(b.label));

  if (retired.length > 0) {
    repos.push({
      label: "Retired repos",
      kind: "retired",
      count: retired.length,
      desc: "Archived projects",
      commits: retired.reduce((n, s) => n + s.commits, 0),
      loc: retired.reduce((n, s) => n + s.loc, 0),
      weekly: weekStarts.map((_, i) => ({
        added: retired.reduce((n, s) => n + s.weekly[i].added, 0),
        removed: retired.reduce((n, s) => n + s.weekly[i].removed, 0),
      })),
    });
  }

  // The running total is anchored so it ends exactly on the real line count at HEAD.
  const netTotal = series.reduce((n, s) => n + s.weekly.reduce((m, w) => m + w.added - w.removed, 0), 0);
  let running = series.reduce((n, s) => n + s.loc, 0) - netTotal;
  let weeks = weekStarts.map((start, i) => {
    const added = series.reduce((n, s) => n + s.weekly[i].added, 0);
    const removed = series.reduce((n, s) => n + s.weekly[i].removed, 0);
    running += added - removed;
    return { start, added, removed, loc: running };
  });

  // Optional `chartStart`: earlier weeks are folded into the starting total instead of drawn.
  const from = config.chartStart ? Math.max(0, weekStarts.findIndex((w) => w >= mondayOf(new Date(config.chartStart)))) : 0;
  if (from > 0) {
    weeks = weeks.slice(from);
    for (const r of repos) r.weekly = r.weekly.slice(from);
  }

  const login = (await api(token, "/user")).login;
  const windowStart = Date.now() - 365 * DAY;
  const activeRepos = perRepo
    .filter((r) => r.history.commits.some((c) => c.date.getTime() >= windowStart))
    .map((r) => r.entry.repo);
  const contributions = await fetchContributions(token, login, activeRepos);

  const out = {
    generatedAt: new Date().toISOString(),
    totals: { repos: series.length, commits: series.reduce((n, s) => n + s.commits, 0), loc: weeks.length > 0 ? weeks[weeks.length - 1].loc : 0 },
    weeks,
    repos,
    contributions,
  };

  const forbidden = hidden.flatMap((full) => [full, full.split("/")[1]]);
  const leaks = findLeaks(JSON.stringify(out), forbidden);
  if (leaks.length > 0) fail(`refusing to write: ${leaks.length} hidden repo name(s) appear in the output (reword their description or label)`);

  const stable = (o) => JSON.stringify({ ...o, generatedAt: "" });
  const previous = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")) : null;
  if (previous && stable(previous) === stable(out)) {
    log("no changes");
  } else {
    writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
    log(`wrote stats for ${series.length} repos, ${out.totals.commits} commits, ${out.totals.loc} lines`);
  }

  if (unreviewed.length > 0) {
    const msg = `${unreviewed.length} repo(s) on GitHub are not in the stats config and were excluded. Run \`node scripts/compute-stats.mjs --check --config <path>\` locally to list them.`;
    log(IN_CI ? `::warning::${msg}` : msg);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Stats\n${msg}\n`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => fail(e?.message ?? "unexpected error"));
}
