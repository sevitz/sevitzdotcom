# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring and executive contacts (recruiters, founders, boards) evaluating Adrian Sevitz for CTO / technology director roles. They arrive to judge credibility and personality, then view the CV or make contact. Secondary: readers of Thoughts and Open Tabs.

## Product Purpose

sevitz.com is Adrian Sevitz's personal portfolio: founder, CTO and technology director. It presents who he is, his CV, his writing and a way to get in touch. Success is a hiring/executive visitor leaving with a clear, memorable impression and either opening the CV or contacting him.

## Positioning

Few leadership portfolios combine all of: Adrian's own travel photography as the hero (rotating, captioned), a "Stats for geeks" page with honest live data on code, GitHub and Claude usage, original writing (Thoughts, Open Tabs with editor notes), and a dry, witty voice ("Once edited a script with Oliver Stone").

## Operating Context

Static Astro site deployed on Cloudflare Workers (every page prerendered). Copy lives in `src/data/site.ts`; posts live in the separate public repo `sevitz/thoughts-about` and are fetched at build. Stats are refreshed weekly by a GitHub workflow from a private approval config. Branch pushes produce access-gated Worker previews.

## Capabilities and Constraints

- Pages: home (hero, about, latest, links, contact), CV, Thoughts, Stats for geeks, unlinked hero-images viewer.
- Stack is Astro; static output only. Legacy dependencies (Bootstrap 3, Font Awesome 4, inherited from the original template) are not binding and may be dropped.
- Contact email and phone stay hidden from scrapers: obfuscated at build, revealed only on click.
- Private repos must never be exposed: codenamed, retired, ignored and unapproved repo names must not appear anywhere in the shipped output (the stats leak guard stays).

## Brand Commitments

Name: Adrian Sevitz; wordmark "Sev". Voice is understated and witty, first person. Hero imagery is Adrian's own photography with place and year captions.

## Evidence on Hand

Real CV (`src/data/cv.ts`), published posts, personal photos in `public/img/hero/`, generated stats in `src/data/stats.json` and `src/data/claude-usage.json`. No testimonials or client logos are on hand; do not fabricate any.

## Product Principles

- Credibility first, personality second: a hiring visitor should trust within seconds, then be charmed.
- Real over claimed: show real photos, real data, real writing rather than assertions.
- Privacy by default: never leak private repos or scrapable contact details.
- Stay light: static, fast, minimal dependencies.
