# SEVITZDOTCOM

Personal portfolio site for Adrian Sevitz.

Live site: https://sevitz.com

Built with [Astro](https://astro.build), deployed on [Cloudflare Pages](https://pages.cloudflare.com). Originally based on a template from [themewagon.com](https://themewagon.com/themes/johndoe-free-one-page-portfolio-website-template/), later migrated off GitHub Pages.

## Development

```sh
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # serve the build locally via wrangler (Cloudflare Pages runtime)
```

Site copy (bio, tagline, contact details, nav) lives in `src/data/site.ts` — edit that file for content changes rather than the components.

## Contact form

`src/pages/api/contact.ts` is a Cloudflare Pages Function that verifies a Cloudflare Turnstile challenge and sends mail via [Resend](https://resend.com). It needs two secrets, set as Cloudflare Pages environment variables (Production and Preview) in the dashboard:

- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`

And one public build-time variable for the Turnstile widget's site key:

- `PUBLIC_TURNSTILE_SITE_KEY`

Copy `.dev.vars.example` to `.dev.vars` (gitignored) to test locally with `npm run preview`. Without `RESEND_API_KEY` configured, the form fails gracefully with a message pointing at a direct email instead.

## Deployment

Cloudflare Pages is connected to this repo for auto-deploy on push. Build command: `npm run build`, output directory: `dist`.
