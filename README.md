# SEVITZDOTCOM

Personal portfolio site for Adrian Sevitz.

Live site: https://sevitz.com

Built with [Astro](https://astro.build), deployed on [Cloudflare Pages](https://pages.cloudflare.com) as a static site. Originally based on a template from [themewagon.com](https://themewagon.com/themes/johndoe-free-one-page-portfolio-website-template/), later migrated off GitHub Pages.

## Development

```sh
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the build locally
```

Site copy (bio, tagline, contact details, nav) lives in `src/data/site.ts`. Edit that file for content changes rather than the components.

## Contact details

Phone and email in `src/data/site.ts` are stubbed placeholders (`09990 999 999`, `xxxx@yyy.com`) rather than the real values, so they aren't sitting in the shipped page as plain, scrapable text. Location and LinkedIn are unstubbed since those aren't targeted by the same kind of scraping. Real contact details are planned to be served through a click-to-reveal mechanism instead; see the plan doc for the design.

## Deployment

Cloudflare Pages is connected to this repo for auto-deploy on push. Build command: `npm run build`, output directory: `dist`.
