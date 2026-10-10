---
name: sevitz.com
description: Adrian Sevitz's portfolio: flat warm colour blocks, heavy Geist type, and his own photography as the hero.
colors:
  paper: "oklch(0.985 0.018 90)"
  ink: "oklch(0.21 0.02 40)"
  muted: "oklch(0.46 0.015 50)"
  rule: "oklch(0.88 0.02 80)"
  card: "oklch(0.995 0.008 90)"
  ember: "oklch(0.6 0.19 25)"
  on-ember: "oklch(0.99 0.01 90)"
  amber-band: "oklch(0.83 0.12 75)"
  add-green: "oklch(0.58 0.15 150)"
  night-paper: "oklch(0.18 0.012 40)"
  night-ink: "oklch(0.95 0.015 90)"
  night-ember: "oklch(0.7 0.17 28)"
  hero-night: "oklch(0.2 0.03 45)"
typography:
  display:
    fontFamily: "Geist, Helvetica, Arial, sans-serif"
    fontSize: "clamp(96px, 13vw, 190px)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "-0.06em"
  headline:
    fontFamily: "Geist, Helvetica, Arial, sans-serif"
    fontSize: "clamp(48px, 9vw, 96px)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Geist, Helvetica, Arial, sans-serif"
    fontSize: "52px"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Geist, Helvetica, Arial, sans-serif"
    fontSize: "clamp(19px, 2vw, 24px)"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  label:
    fontFamily: "Geist, Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: "0.1em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
rounded:
  none: "0"
  caption: "6px"
spacing:
  gutter: "clamp(20px, 5vw, 56px)"
  card-gap: "16px"
  card-padding: "28px"
components:
  card-cv:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.on-ember}"
    rounded: "{rounded.none}"
    padding: "28px"
  card-thoughts:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "28px"
  about-band:
    backgroundColor: "{colors.amber-band}"
    textColor: "{colors.ink}"
  stats-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "20px 24px"
---

# Design System: sevitz.com

## Overview

**Creative North Star: "The Field Notebook"**

A warm-paper page with confident flat blocks of colour, one oversized wordmark, and photographs Adrian took himself, each captioned with place and year like a note in the margin. It reads as a person's working notebook, not a corporate brochure: the voice is dry, the structure is firm, and nothing is decorative that cannot be explained.

Hiring and executive visitors should trust it in seconds, then be charmed. Credibility comes from order (strict grid, hard rules, sharp corners, real data). Personality comes from the photos, the rotating tagline and the small asides.

**Key Characteristics:**
- Flat colour fields and 3px rules instead of shadows or gradients (outside the photo scrim).
- Geist at heavy weight and tight tracking for display; uppercase tracked labels for structure.
- Sharp corners everywhere except the photo caption pill.
- Light and dark themes via `prefers-color-scheme`; the hero is always dark because it sits on a photo.
- Real photography and real data only; no stock imagery, no invented proof.

## Colors

A warm cream paper, near-black warm ink, one ember accent and one amber band. Every neutral is tinted toward warm brown (hue 40-90); there is no pure black or white.

### Primary
- **Ember** (oklch(0.6 0.19 25)): The single accent. CV card, link hover, section-head links, contact rules, focus rings. In dark mode it lifts to **Night Ember** (oklch(0.7 0.17 28)).

### Secondary
- **Amber Band** (oklch(0.83 0.12 75)): The About section's full-bleed field, and the hover colour of contact rules. Darkens to oklch(0.35 0.06 60) in dark mode.
- **Add Green** (oklch(0.58 0.15 150)): Stats only, for additions in code charts.

### Neutral
- **Paper** (oklch(0.985 0.018 90)): Page background. Dark: **Night Paper** (oklch(0.18 0.012 40)).
- **Ink** (oklch(0.21 0.02 40)): Text, the Thoughts card, section-head rules. Dark: **Night Ink** (oklch(0.95 0.015 90)).
- **Muted** (oklch(0.46 0.015 50)): Labels and secondary text.
- **Rule** (oklch(0.88 0.02 80)): Hairline borders on stats cards and page bars.
- **Card** (oklch(0.995 0.008 90)): Stats card surface.
- **Hero Night** (oklch(0.2 0.03 45)): Hero fallback behind photos, fixed in both themes.

### Named Rules
**The One Ember Rule.** Ember is the only accent. A screen has one dominant ember field at most (the CV card); elsewhere it appears as small links, rules and focus.
**The Warm Neutral Rule.** No pure grey, black or white. Neutrals carry the warm hue of the paper.

## Typography

**Display / Body / Label Font:** Geist (with Helvetica, Arial, sans-serif)
**Mono Font:** Geist Mono (versions, footer links, stats numerals)

**Character:** One family doing everything. Hierarchy comes from weight, size and tracking contrast: huge and tight for names, small and wide uppercase for structure.

### Hierarchy
- **Display** (700, clamp(96px, 13vw, 190px), 0.8, -0.06em): The "Sev" wordmark in the hero.
- **Headline** (700, clamp(48px, 9vw, 96px), 0.95, -0.04em): Page titles.
- **Title** (700, 52px, 0.9, -0.04em): Card titles (CV, Thoughts).
- **Body** (500, clamp(19px, 2vw, 24px), 1.45, -0.01em): About copy and ledes, capped around 44ch.
- **Label** (700, 15px, 0.1em, uppercase): Section labels, eyebrow, navigation. The hero tagline is the same voice at 500, 0.12em.
- **Mono** (400, 12px): Footer, version, stats.

### Named Rules
**The Weight Contrast Rule.** Heavy (700) against regular reading text; no mid-weight display. Headlines are tracked tight, labels tracked wide.
**The Readable Prose Rule.** Long-form text (posts, CV) uses normal case, 1.5+ line-height, and a measure of 65-75ch. Uppercase tracking is for labels only.

## Layout

Single fluid column with a shared horizontal gutter, `clamp(20px, 5vw, 56px)`, on every section. Sections stack: hero, two cards, latest thoughts, about band, contact. Cards and contact items use `repeat(auto-fit, minmax(min(100%, 340px | 200px), 1fr))`, so they reflow without breakpoints. Rhythm is generous and clamp-based (e.g. 40-88px vertical section padding). Prose pages cap at 900px. Below 720px the hero stacks and cards shorten so Latest thoughts lands on the first screen. Reduced-motion is honoured.

## Elevation & Depth

Flat. Depth comes from tonal colour fields, full-bleed bands and hard 3px rules (ink under section heads, ember under contact items). There are no box-shadows on the home system. The only lift is motion: cards rise 6px on hover. The photo hero is the one place with gradients: a dark scrim keeps text legible over any picture.

### Named Rules
**The Flat-By-Default Rule.** Surfaces never carry shadows. State is shown by colour change and a translateY, never by glow or blur.

## Shapes

Sharp. Cards, bands, stats cards and rules are square-cornered rectangles. The sole rounded element is the hero photo caption pill (6px) so it reads over any photo. Borders are hairlines (1px Rule) on data cards and 3px solid rules as structural dividers. Taglines get a 2px ember-dot left border.

## Components

### Cards (CV / Thoughts)
- **Shape:** Square, 28px padding, 176px minimum height, 16px grid gap.
- **CV:** Ember field, on-ember text. **Thoughts:** Ink field, paper text.
- **Hover:** Rise 6px (0.2s); colours stay put. Title 52px/700, with a 28px arrow top right.

### Hero
- Full-bleed photo layers crossfading (1.2s) beneath a left-weighted dark scrim, with wordmark top-left, nav top-right, "Sev" display type and a rotating uppercase tagline bottom, and a caption pill bottom right (place, year).

### Section heads
- Uppercase 15px/700 label with a 3px Ink rule beneath; a quiet Ember link aligned right.

### About band
- Full-bleed Amber Band with the 24px body copy at 44ch max, label column to the left.

### Contact items
- Unstyled buttons/links with an uppercase muted label, 17px value and a 3px Ember underline rule; rule shifts to Amber on hover. Values stay hidden until clicked.

### Stats cards
- 1px Rule border on Card surface, 20px padding, 18px/600 title, inline SVG charts with muted axes and Add Green accents.

### Navigation
- Text-only, in the hero bar: wordmark left, links right at label style, hover to amber. Content pages use a hairline-bottomed page bar.

## Do's and Don'ts

### Do:
- **Do** keep every surface flat and square-cornered; use the 3px rule for emphasis.
- **Do** tint all neutrals warm and keep one ember accent.
- **Do** pair huge, tight, bold type with small, wide, uppercase labels.
- **Do** caption photos with place and year, and use only Adrian's own pictures.
- **Do** make the CV and other reading pages sympathetic to this system (Geist, warm paper, ember links, square rules) while putting readability first: normal-case text, high contrast, 65-75ch measure, clear hierarchy, and a professional CV structure.
- **Do** support both colour schemes and `prefers-reduced-motion`.

### Don't:
- **Don't** add shadows, glows, glassmorphism or gradients outside the hero scrim.
- **Don't** introduce a second accent colour, or use pure black/white/grey.
- **Don't** round corners (outside the caption pill) or use pill buttons.
- **Don't** put long text in uppercase or tracked-out styling.
- **Don't** let the CV drift back to the legacy Bootstrap 3 look (#E04343 red, Open Sans, dashed underlines); `global.css` and Bootstrap are legacy to migrate away from.
- **Don't** invent testimonials, logos or metrics.
