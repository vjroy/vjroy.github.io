# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio for Veejhay Roy, hosted on GitHub Pages. Built with **Astro**
(static output, TypeScript). A clean, light, gallery-style site inspired by
award-style studio portfolios. The previous terminal-emulator version of the site
is preserved verbatim as an easter egg at the `/terminal` route.

## Development

```bash
npm install
npm run dev        # dev server (default http://localhost:4321)
npm run build      # static build → dist/
npm run preview    # serve the built site
```

No linter or test suite. Node + npm are required (not always present on a fresh machine).

## Deployment

Push to `main` → `.github/workflows/deploy.yml` builds via `withastro/action` and
deploys `dist/` to GitHub Pages. The repo's **Settings → Pages → Source** must be
set to **GitHub Actions** (one-time manual step). This is a user site
(`vjroy.github.io`), so `site` in `astro.config.mjs` is the root with no `base`.

## Architecture

Single scrolling page composed in `src/pages/index.astro` from components in
`src/components/`:

- **Loader** — intro 0→100 count-up that wipes up to reveal the hero.
- **Cursor** — custom dot + lagging ring; pointer-devices only.
- **Nav** — fixed, `mix-blend-mode: difference`; anchor links smooth-scrolled by Lenis.
- **Hero** — big editorial headline (line-mask reveal driven by the loader) + portrait.
- **WorkCarousel** — Embla `dragFree` carousel of project cards; data from `src/data/projects.ts`.
- **About** — statement, prose, skills chips, brief running mention.
- **Footer** — contact links, big email CTA, and the subtle `/terminal` link.

`src/scripts/app.ts` boots all behaviour (Lenis smooth scroll, anchor handling,
loader, IntersectionObserver reveals for `[data-reveal]`, custom cursor, Embla).
Everything degrades when `prefers-reduced-motion` is set or there is no fine pointer.

`src/pages/terminal.astro` is **standalone** — it carries its own dark CSS and loads
`public/terminal.js` (the original `script.js`, with asset paths made absolute). It
does not use `Base.astro`, so the main site's tokens never leak into it.

### Styling
- `src/styles/global.css` holds design tokens (light palette), reset, fluid type
  scale, reveal base state, and reduced-motion overrides. Components use scoped
  `<style>` blocks.
- Font: **General Sans** via Fontshare CDN (closest free match to PP Neue Montreal).
  To switch to licensed PP Neue Montreal: add woff2 files to `public/fonts/`,
  add `@font-face` rules in `global.css`, and put it first in `--font-sans`.

### Assets
Everything served statically lives in `public/`: `pic2.jpg`, the PDFs
(`Resume_Veejhay.pdf`, `HarvardX.pdf`, `LLM_Research (1).pdf`, `Final Project.pdf`),
`favicon.svg`, and `terminal.js`. Reference them with absolute paths (`/pic2.jpg`).
