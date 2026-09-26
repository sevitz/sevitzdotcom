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

Phone and email are real values in `src/data/site.ts`, but the Phone and Email boxes on the page don't show them until clicked. `src/lib/obfuscate.ts` scrambles each value at build time (shift, reverse, split into two parts) into what actually gets printed into the HTML; the real value never appears as a contiguous string in the shipped output. A click-handler in `Contact.astro` reverses the scramble in the browser and swaps the button for a real `mailto:`/`tel:` link. Not a security boundary, just enough to defeat the regex/HTML scrapers that harvest plain-text contact details. Location, LinkedIn, and CV are unstubbed since they aren't targeted the same way.

## Deployment

Cloudflare Pages is connected to this repo for auto-deploy on push. Build command: `npm run build`, output directory: `dist`.
