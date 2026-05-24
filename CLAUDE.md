# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static personal portfolio site for Veejhay Roy, hosted on GitHub Pages. No build step — changes to `index.html`, `styles.css`, or `script.js` are deployed by pushing to the `main` branch. The `.nojekyll` file disables Jekyll processing.

## Development

Open `index.html` directly in a browser, or use a local server to avoid CORS issues with the PDF assets:

```bash
python3 -m http.server 8080
```

No package manager, no linter, no test suite.

## Architecture

The site is a single page with three sections driven by `script.js`:

- **Loading screen** (`setupLoadingScreen`) — runs a `NumberTicker` from 0→100%, then blur-fades the hero content in. Fires a `loading-screen-complete` custom event when done.
- **Hero** — typing animation for name/title; particle canvas background (`setupParticles`) using mouse-position magnetism; spinning text ring around the profile image (`setupSpinningText`); macOS-style dock (`setupDockAnimation`) with `window.open`-based click handling to work around z-index conflicts with the GSAP-pinned about section.
- **About** — GSAP `ScrollTrigger` pins `.about-pin-wrap` while the user scrolls, progressively revealing characters by adjusting `opacity` and `font-weight` (`setupAboutAnimation`).
- **Projects** — manual CSS transform carousel (`setupProjectsCarousel`), no library.

### External CDN dependencies (loaded in `index.html`)
- GSAP 3.12.5 + ScrollTrigger (about section)
- simple-parallax-js 5.6.2
- Google Fonts: Inter, JetBrains Mono

### Key z-index notes
The dock uses `z-index: 99999–1000001` via inline `!important` styles and a document-level capture listener because the GSAP-pinned `.about-pin-wrap` intercepts pointer events at high z-index. `window.particleField` is exposed globally for potential reuse.
