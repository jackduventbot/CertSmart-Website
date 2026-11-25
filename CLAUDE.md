# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing site for CertSmart (insurance-compliance / certificate-of-insurance software). Plain HTML + one CSS file + one JS file — no framework, no bundler, no package.json, no tests. Hosted on GitHub Pages from `main` / repo root: https://jackduventbot.github.io/CertSmart-Website/ (redeploys ~1 min after a push). The original site being redesigned is https://certsmart.ai/.

## The HTML is generated — edit `tools/build.mjs`, not the `.html` files

All five pages (`index`, `about`, `how-it-works`, `vision`, `contact`) are written by `tools/build.mjs`. It holds the shared `<head>`, patent bar, header/nav, footer, the Lucide icon helper `ic(name)` (paths in `tools/icons.json`), and every page's content as template literals. Hand edits to the `.html` files are overwritten on the next build.

```sh
node tools/build.mjs .          # regenerate all pages into the repo root
node tools/serve.mjs .          # local preview at http://127.0.0.1:5173 (supports HTTP Range, needed for video seeking)
```

- Cache busting: `const V = "..."` in `build.mjs` is appended to `css/style.css?v=` and `js/main.js?v=` on every page. Change it whenever CSS or JS changes.
- New icon: add its Lucide SVG inner markup to `tools/icons.json`, then use `${ic("name")}`.
- `page(filename, title, bodyClass, main, desc)` — `desc` becomes the meta/OG description.

## CSS architecture (`css/style.css`)

Everything is driven by tokens in `:root` — use them rather than literal values; a full audit normalized the site onto them:

- Type tiers: `--fs-h3` (compact card title), `--fs-h3-lg` (photo/feature card), `--fs-h3-xl` (featured), `--fs-lead` (first/intro paragraph of a section — use `class="lead"`, follow-on paragraphs stay body size), `--fs-card`, `--fs-small` (captions/meta), `--fs-label` (eyebrows, pills, tags).
- Spacing: `--section` (section padding), `--gap` (grid gaps), `--gap-lg` (between layout columns), `--pad-card` / `--pad-panel`.
- Shape: `--r-card` 16px (top-level cards/media), `--r-inner` 12px (nested items, tiles, badges), `--r-btn` 10px, `--r-input` 8px. Icon tiles are `--tile` 44px with `--tile-icon` 22px.
- Color: navy base, red (`--red`) only for primary buttons and the `.mark` headline word, gold as highlight. Text on navy/photos uses `--on-dark` / `--on-dark-muted`.
- `.wrap` is the fluid full-width container (gutters only). Layout must fill the viewport at every width; above 1600px the root font-size scales with `vw` so zoomed-out views keep proportions.
- Section pattern: `<section class="section [section--alt|section--tight-top]"><div class="wrap">…`, usually opened by `.section-head` (eyebrow + `.h2` left, short paragraph right).

## JS (`js/main.js`)

One `DOMContentLoaded` handler with independent, guarded blocks:

- Mobile nav toggle.
- **Home video hero** (`[data-film]`): three muted clips in `assets/video/hero-*.mp4` crossfade (~1.2s overlap, triggered from `timeupdate`), progress bars jump between clips, a pause toggle; pauses off-screen/hidden-tab; no autoplay under `prefers-reduced-motion`.
- **How It Works steps** (`[data-steps]`): each step's `data-start` (seconds, set in `build.mjs`) seeks `assets/video/how-it-works-demo.mp4`; playback drives active/done states and progress. If the demo video is re-edited, re-derive these timestamps (ffmpeg is installed; extract frames to find step boundaries).
- **Contact form**: posts to Formspree via `fetch` (endpoint is the form's `action` in `build.mjs`); shows/requires the "If Other, please specify" field. Submitting it sends a real message.

## Content and assets

- Copy must stay factual: sourced from the original certsmart.ai text or what the demo video shows (coverages, endorsements, A.M. Best ratings, COI download). Do not invent statistics, customers or testimonials; the two testimonials are verbatim from the original site.
- Photos/videos are Pexels (free commercial license). Avoid stock with visible third-party company logos. Videos are trimmed/compressed with ffmpeg (≈1600px wide, H.264, no audio, `+faststart`).
- `photo/` holds the owner's original logo and founder photo; the site uses the copies in `assets/img/`.
- Owner preferences established so far: restrained red, images on plain page background rather than tinted panels (hero/dashboard), no tilt/float effects on the hero image, footer on a single row.
