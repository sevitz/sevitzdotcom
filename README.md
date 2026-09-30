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

## Thoughts about content

Posts live in the public repo [`sevitz/thoughts-about`](https://github.com/sevitz/thoughts-about), not here. `npm run build` and `npm run dev` first run `scripts/fetch-thoughts.mjs`, which downloads `main` into the gitignored `.content/thoughts-about/`. Only `status: published` posts get pages, feed entries and sitemap entries.

- Local fixture: `THOUGHTS_CONTENT_DIR=/path/with/posts npm run build`.
- With `CI` set, a failed download fails the build; locally it only warns.
- A merge to the posts repo rebuilds the site through a Workers Builds deploy hook (secret `CF_PAGES_DEPLOY_HOOK_URL` in the posts repo). The hook URL is never committed.
