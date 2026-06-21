# Veejhay Roy — Personal Portfolio

**Live site:** [vjroy.github.io](https://vjroy.github.io)

A clean, gallery-style portfolio built with [Astro](https://astro.build): hero, a
drag-to-navigate work carousel, about, and contact — plus a hidden terminal
easter egg at [`/terminal`](https://vjroy.github.io/terminal) (the previous
version of this site), reachable from a subtle footer link.

## Stack

- **Framework:** Astro (static output), TypeScript
- **Motion:** [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll,
  [Embla](https://www.embla-carousel.com/) drag carousel, IntersectionObserver
  scroll-reveals, a custom cursor, and an intro loader. All gated behind
  `prefers-reduced-motion` and pointer capability.
- **Type:** General Sans (Fontshare) — closest free match to PP Neue Montreal
- **Hosting:** GitHub Pages via GitHub Actions

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static build → dist/
npm run preview    # preview the production build
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`withastro/action` and publishes `dist/` to GitHub Pages.

> One-time setup: in the repo **Settings → Pages**, set **Source** to
> **GitHub Actions**.

## Layout

- `src/pages/index.astro` — single-page site (composes the components below)
- `src/pages/terminal.astro` — self-contained terminal easter egg
- `src/components/` — `Nav`, `Hero`, `WorkCarousel`, `About`, `Footer`, `Cursor`, `Loader`
- `src/data/projects.ts` — project content (single source for the carousel)
- `src/scripts/app.ts` — smooth scroll, loader, reveals, cursor, carousel
- `src/styles/global.css` — design tokens, reset, typography
- `public/` — images, PDFs, fonts, favicon, `terminal.js`

## Contact

**Email:** [usroyvj@gmail.com](mailto:usroyvj@gmail.com)
