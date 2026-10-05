# SEVITZDOTCOM

Personal portfolio site for Adrian Sevitz.

Live site: https://sevitz.com

Built with [Astro](https://astro.build), deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) as a static site. Originally based on a template from [themewagon.com](https://themewagon.com/themes/johndoe-free-one-page-portfolio-website-template/), later migrated off GitHub Pages.

## Development

```sh
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the build locally
```

Site copy (bio, tagline, contact details, nav) lives in `src/data/site.ts`. Edit that file for content changes rather than the components.

## Contact details

Phone and email are real values in `src/data/site.ts`, but the Phone and Email boxes on the page don't show them until clicked. `src/lib/obfuscate.ts` scrambles each value at build time (shift, reverse, split into two parts) into what actually gets printed into the HTML; the real value never appears as a contiguous string in the shipped output. A click-handler in `Contact.astro` reverses the scramble in the browser and swaps the button for a real `mailto:`/`tel:` link. Not a security boundary, just enough to defeat the regex/HTML scrapers that harvest plain-text contact details. Location, LinkedIn, and CV are unstubbed since they aren't targeted the same way.

## Deployment

Cloudflare Workers Builds is connected to this repo. Config lives in `wrangler.jsonc`: the Worker only serves the static `dist/` build (every page is prerendered).

- **Production:** a push to `master` runs `npm run build` then `npx wrangler deploy`, which updates sevitz.com.
- **Branch previews:** a push to any other branch runs `npm run build` then `npx wrangler preview`, which creates or updates a [Worker Preview](https://developers.cloudflare.com/workers/previews/) for that branch on a `workers.dev` Preview URL. Production is untouched, and Cloudflare comments the Preview URL on the PR.
- Previews sit behind Cloudflare Access (Worker, then Settings, then Domains & Routes), so only allowed emails can open them.
- The `previews` block in `wrangler.jsonc` holds preview-only settings. It is empty because the site has no bindings or secrets.

## Stats for geeks

`/stats-for-geeks/` shows contributions, a per-repo table and total lines of code over time, all drawn as inline SVG from one committed file, `src/data/stats.json`.

- **Refresh:** `.github/workflows/stats.yml` runs weekly (Mondays) and on demand (Actions, then Refresh stats, then Run workflow). It runs `scripts/compute-stats.mjs`, and if the numbers changed it commits `src/data/stats.json` to `master`, which triggers the normal Workers Builds deploy. No change means no commit and no deploy. A failed run emails you, and the page keeps showing the last good data with its "Last updated" date.
- **Never in the build:** the script is deliberately not part of `prebuild`. Cloudflare's build has no token and must not clone private repos. Locally: `npm run stats -- --config <path>`.
- **Approval config (private):** this repo is public, so the list of repos lives in the private repo `sevitz/claude-library` at `dev/stats/repos.json`. Each repo is `show: "name"`, `"codename"` (needs a `label`) or `"retired"` (folded into one "Retired repos" row). `ignore` lists repos left out on purpose, with a reason. The optional `chartStart` (a date) folds earlier weeks into the starting total.
- **New repos are invisible until approved.** A repo that is in neither list is excluded from everything, and the workflow only logs how many there are. List them with `node scripts/compute-stats.mjs --check --config <path>` (local only; it also shows the cleanup candidates and exactly what description and website would be published).
- **Descriptions and websites** come from each repo's GitHub description and Website field, so treat those as public for any approved repo.
- **Leak guard:** before writing, the script refuses to continue if the real name of a retired, ignored, unapproved or codenamed repo appears anywhere in the output. Action logs are public here, so only counts are logged and hidden names are masked.
- **Token:** the workflow uses the repo secret `STATS_GITHUB_TOKEN`, a fine-grained personal access token with read-only Contents, Metadata, Issues and Pull requests on all repos. It expires within a year (renew it before then: create a new token, then `pbpaste | gh secret set STATS_GITHUB_TOKEN --repo sevitz/sevitzdotcom`). If it lapses the page just stops updating.
- **How lines are counted:** text files at HEAD, excluding lockfiles, minified, map, svg and `dist/` files; the weekly series comes from `git log --numstat` and is anchored to the exact HEAD total. The contribution total is GitHub's calendar; pull requests, issues and reviews come from the search API and commits are the remainder, which matches the profile's Activity overview.

## Thoughts about content

Posts live in the public repo [`sevitz/thoughts-about`](https://github.com/sevitz/thoughts-about), not here. `npm run build` and `npm run dev` first run `scripts/fetch-thoughts.mjs`, which downloads `main` into the gitignored `.content/thoughts-about/`. Only `status: published` posts get pages, feed entries and sitemap entries.

- Local fixture: `THOUGHTS_CONTENT_DIR=/path/with/posts npm run build`.
- With `CI` set, a failed download fails the build; locally it only warns.
- A merge to the posts repo rebuilds the site through a Workers Builds deploy hook (secret `CF_PAGES_DEPLOY_HOOK_URL` in the posts repo). The hook URL is never committed.
