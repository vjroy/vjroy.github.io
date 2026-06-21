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
npm run dev          # dev server (default http://localhost:4321)
npm run build        # static build → dist/
npm run preview      # serve the built site
npm run check        # astro check — typecheck .astro + .ts (use this, NOT raw tsc)
npm run format       # prettier --write . (format-on-edit hook runs this per file)
npm run format:check # prettier --check . (CI / pre-commit gate)
```

Node + npm are required (not always present on a fresh machine). Quality gate:
**Prettier** (config in `.prettierrc.json`; `prettier-plugin-astro`) and **`astro check`**
for types. No unit-test suite — verify UI changes by running the app (`npm run dev`
or the `/verify` skill) and, for logic in `src/scripts/`, by reasoning + build.

`src/layouts/Base.astro` is in `.prettierignore`: the plugin can't parse the
`<script>` nested inside its `{loading && (…)}` expression. Format it by hand if you
touch it; everything else is auto-formatted.

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

## Conventions

These are Astro components (`.astro`), **not** React. No hooks, no JSX runtime, no
prop-type libraries. The frontmatter (`---` fence) runs at build time on the server;
the markup is HTML; client behaviour is plain TypeScript.

### Components

- One component per file in `src/components/`, PascalCase name = filename.
- Type props with a TypeScript `interface Props { … }` in the frontmatter and destructure
  `Astro.props` with defaults (see `Base.astro`). Document non-obvious props with `/** */`.
- Keep styles in a component-scoped `<style>` block; reach for `global.css` only for
  shared design tokens or truly global rules.
- Content/config data goes in `src/data/*.ts` as typed exports (see `projects.ts`), not
  hard-coded in markup — so a card list is `projects.map(...)`, not copy-pasted blocks.
- Shared client behaviour is centralised in `src/scripts/app.ts` and opted into from
  markup via `data-*` hooks (e.g. `[data-reveal]`), rather than per-component `<script>`s.

### Accessibility (treat as required, not optional)

- Semantic HTML first: `<header>/<nav>/<main>/<section>/<footer>`, real `<button>`/`<a>`,
  one `<h1>` per page, ordered headings. The skip-link (`a.skip-link → #main`) and
  `<html lang="en">` live in `Base.astro` — keep them.
- Every interactive control is keyboard-reachable with a visible focus style; icon-only
  controls get an `aria-label`. Images get meaningful `alt` (empty `alt=""` if decorative).
- **Honour `prefers-reduced-motion`**: every animation in `app.ts`/`global.css` already
  degrades when it's set or there's no fine pointer — any new motion must do the same.
- Maintain colour contrast against the light palette tokens; don't convey state by colour alone.

### Code style

- Prettier owns formatting (100 cols, single quotes, semicolons) — don't hand-fight it.
- `astro/tsconfigs/strict` is on; keep it warning-clean (`npm run check`). No `any`; prefer
  precise types and `as const` for literal data.
- Prefer small, composable components and early returns over deep nesting.
