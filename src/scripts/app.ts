/**
 * Front-end behaviour for the home page:
 *   1. Lenis smooth scroll (+ anchor links)
 *   2. Intro loader count-up → hero reveal
 *   3. Scroll-reveal for [data-reveal] elements
 *   4. Custom cursor (pointer devices only)
 *   5. Embla drag carousel for the work section
 *
 * Everything degrades gracefully when prefers-reduced-motion is set or when
 * the device has no fine pointer.
 */
import Lenis from 'lenis';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ── 1. Smooth scroll ──────────────────────────────────────── */
let lenis: Lenis | null = null;

function initSmoothScroll() {
  if (reduceMotion) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  const raf = (time: number) => {
    lenis!.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

function initAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (!reduceMotion) triggerWarp();
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
}

// Brief full-page "warp" punch on a section jump (scale dip + blur flash).
let warpTimer: number | undefined;
function triggerWarp() {
  document.body.classList.remove('is-warp');
  // Force a reflow so re-adding the class restarts the animation.
  void document.body.offsetWidth;
  document.body.classList.add('is-warp');
  window.clearTimeout(warpTimer);
  warpTimer = window.setTimeout(() => document.body.classList.remove('is-warp'), 750);
}

/* ── 2. Loader → hero reveal ───────────────────────────────── */
function revealHero() {
  document.body.removeAttribute('data-loading');
  if (lenis) lenis.start();

  const lines = document.querySelectorAll<HTMLElement>('[data-hero-line]');
  const fades = document.querySelectorAll<HTMLElement>('[data-hero-fade]');

  lines.forEach((el, i) => {
    el.style.transition = `transform 0.9s cubic-bezier(0.22,1,0.36,1) ${0.05 * i}s`;
    requestAnimationFrame(() => (el.style.transform = 'translateY(0)'));
  });
  fades.forEach((el, i) => {
    el.style.transition = `opacity 0.8s ease ${0.3 + 0.08 * i}s`;
    requestAnimationFrame(() => (el.style.opacity = '1'));
  });
}

function initLoader() {
  const loader = document.querySelector<HTMLElement>('[data-loader]');
  const countEl = document.querySelector<HTMLElement>('[data-loader-count]');

  if (reduceMotion || !loader || !countEl) {
    loader?.remove();
    revealHero();
    return;
  }

  if (lenis) lenis.stop();

  let pct = 0;
  const tick = () => {
    pct += Math.max(1, Math.round((100 - pct) * 0.08));
    if (pct >= 100) pct = 100;
    countEl.textContent = String(pct);
    if (pct < 100) {
      setTimeout(tick, 90);
    } else {
      loader.classList.add('is-done');
      loader.style.transition = 'transform 0.8s cubic-bezier(0.76,0,0.24,1), opacity 0.6s';
      loader.style.transform = 'translateY(-100%)';
      revealHero();
      setTimeout(() => loader.remove(), 900);
    }
  };
  setTimeout(tick, 250);
}

/* ── 3. Scroll reveal ──────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  // Toggle (don't unobserve): elements re-hide when they leave and replay the
  // entrance every time they scroll back into view — deliberately intense.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-in', entry.isIntersecting);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
  );
  els.forEach((el) => io.observe(el));
}

/* ── 4. Custom cursor ──────────────────────────────────────── */
function initCursor() {
  const el = document.querySelector<HTMLElement>('[data-cursor-el]');
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  const ring = document.querySelector<HTMLElement>('[data-cursor-ring]');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!finePointer || reduceMotion || !el || !dot || !ring) {
    el?.remove();
    return;
  }

  document.body.classList.add('has-cursor');
  let mx = window.innerWidth / 2,
    my = window.innerHeight / 2;
  let rx = mx,
    ry = my;

  // Magnetic snap: when set, the ring eases toward this point (a link/button's
  // centre) instead of the raw pointer position, with a few px of "give".
  let magnetX: number | null = null;
  let magnetY: number | null = null;
  const MAGNET_PULL = 0.35;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    document.body.classList.add('cursor-ready');
  });

  const loop = () => {
    const tx = magnetX ?? mx;
    const ty = magnetY ?? my;
    rx += (tx - rx) * (magnetX === null ? 0.18 : MAGNET_PULL);
    ry += (ty - ry) * (magnetY === null ? 0.18 : MAGNET_PULL);
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  // Contextual label + state class, shared by the hover wiring below.
  const setContext = (text: string, stateClass: string) => {
    if (label) label.textContent = text;
    document.body.classList.remove('cursor-view', 'cursor-drag');
    document.body.classList.add(stateClass);
  };
  // Re-derive context from an ancestor (e.g. leaving a [data-slide] back onto
  // its [data-stage]) instead of always clearing, so nested targets don't
  // stomp on the container's label.
  const restoreContext = (from: HTMLElement) => {
    const card = from.closest<HTMLElement>('[data-cursor-card], [data-slide]');
    const stage = from.closest<HTMLElement>('[data-stage]');
    if (card) setContext('View', 'cursor-view');
    else if (stage) setContext('Drag', 'cursor-drag');
    else {
      if (label) label.textContent = '';
      document.body.classList.remove('cursor-view', 'cursor-drag');
    }
  };

  const hoverTargets = '[data-cursor], [data-cursor-card], [data-slide], [data-stage], a, button';
  document.querySelectorAll<HTMLElement>(hoverTargets).forEach((t) => {
    const isView = t.matches('[data-cursor-card], [data-slide]');
    const isDrag = t.matches('[data-stage]');
    const isMagnetic = t.matches('a, button');

    t.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      if (isView) setContext('View', 'cursor-view');
      else if (isDrag) setContext('Drag', 'cursor-drag');

      if (isMagnetic) {
        const rect = t.getBoundingClientRect();
        magnetX = rect.left + rect.width / 2;
        magnetY = rect.top + rect.height / 2;
      }
    });
    t.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      if (isView || isDrag) restoreContext(t.parentElement ?? t);
      if (isMagnetic) {
        magnetX = null;
        magnetY = null;
      }
    });
  });
}

/* ── 5. 3D coverflow gallery ───────────────────────────────── */
function initGallery() {
  const gallery = document.querySelector<HTMLElement>('[data-gallery]');
  const stage = gallery?.querySelector<HTMLElement>('[data-stage]');
  if (!gallery || !stage) return;

  const slides = Array.from(gallery.querySelectorAll<HTMLElement>('[data-slide]'));
  const metas = Array.from(gallery.querySelectorAll<HTMLElement>('[data-meta]'));
  const prevBtn = gallery.querySelector<HTMLElement>('[data-prev]');
  const nextBtn = gallery.querySelector<HTMLElement>('[data-next]');
  const count = slides.length;
  if (!count) return;

  let active = 0;
  const SPREAD = 0.62; // horizontal spacing as a fraction of slide width
  const ROTATE = 26; // degrees of tilt per step
  const DEPTH = 240; // px pushed back per step

  const layout = () => {
    const w = slides[0].offsetWidth || 480;
    slides.forEach((slide, i) => {
      const pos = i - active;
      const abs = Math.abs(pos);
      const x = pos * w * SPREAD;
      const ry = pos * -ROTATE;
      const z = -abs * DEPTH;
      const scale = pos === 0 ? 1 : 0.82;
      const opacity = abs > 2 ? 0 : pos === 0 ? 1 : 0.55;
      slide.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${scale})`;
      slide.style.opacity = String(opacity);
      slide.style.zIndex = String(100 - abs);
      slide.style.pointerEvents = abs > 2 ? 'none' : 'auto';
      slide.toggleAttribute('data-active', pos === 0);
      slide.setAttribute('aria-hidden', pos === 0 ? 'false' : 'true');
    });
    metas.forEach((m, i) => m.classList.toggle('is-active', i === active));
  };

  const go = (next: number) => {
    active = (next + count) % count;
    layout();
  };

  prevBtn?.addEventListener('click', () => go(active - 1));
  nextBtn?.addEventListener('click', () => go(active + 1));

  // Click a side slide to focus it; clicking the active slide opens its link.
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (i === active) {
        const link = metas[active]?.querySelector<HTMLAnchorElement>('a');
        link?.click();
      } else {
        go(i);
      }
    });
  });

  // Drag / swipe.
  let down = false;
  let startX = 0;
  let moved = false;
  stage.addEventListener('pointerdown', (e) => {
    down = true;
    moved = false;
    startX = e.clientX;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 60 && !moved) {
      moved = true;
      go(active + (dx < 0 ? 1 : -1));
    }
  });
  window.addEventListener('pointerup', () => (down = false));

  // Keyboard when the gallery is in view.
  window.addEventListener('keydown', (e) => {
    const rect = gallery.getBoundingClientRect();
    const visible = rect.top < window.innerHeight * 0.6 && rect.bottom > 0;
    if (!visible) return;
    if (e.key === 'ArrowLeft') go(active - 1);
    if (e.key === 'ArrowRight') go(active + 1);
  });

  window.addEventListener('resize', layout);
  layout();
}

/* ── 6. Scroll-driven FX: velocity skew + image parallax ───── */
function initScrollFX() {
  if (reduceMotion) return;

  // Skew every top-level block by the scroll velocity, easing back to flat
  // when motion stops — a kinetic "drag" as you move between sections.
  const skewTargets = Array.from(
    document.querySelectorAll<HTMLElement>('main > section, main > .marquee'),
  );
  // Cover images that drift within their frames as they cross the viewport.
  const parallaxImgs = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-img]'));
  if (!skewTargets.length && !parallaxImgs.length) return;

  skewTargets.forEach((el) => {
    el.style.willChange = 'transform';
    el.style.transformOrigin = 'center center';
  });

  const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

  let skew = 0;
  const MAX_SKEW = 6; // degrees — cranked for a hard kinetic drag

  const loop = () => {
    const vh = window.innerHeight || 1;

    // Velocity-driven skew (Lenis exposes per-frame velocity in px).
    const v = lenis ? lenis.velocity : 0;
    const skTarget = clamp(v * 0.09, -MAX_SKEW, MAX_SKEW);
    skew += (skTarget - skew) * 0.12;
    if (Math.abs(skew) < 0.001) skew = 0;
    const sk = skew.toFixed(3);

    // Batch all layout reads first, then all writes — avoids per-element thrash.
    const sRects = skewTargets.map((el) => el.getBoundingClientRect());
    const iData = parallaxImgs.map((img) => {
      const r = img.getBoundingClientRect();
      return clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
    });

    // Each block tilts in 3D + recedes the further its middle sits from the
    // viewport centre — flat (in focus) when centred, dramatic at the edges.
    skewTargets.forEach((el, i) => {
      const r = sRects[i];
      const d = clamp((r.top + r.height / 2 - vh / 2) / vh, -1.1, 1.1);
      const rx = (d * 9).toFixed(2); // tilt toward/away from the viewer
      const sc = (1 - Math.abs(d) * 0.08).toFixed(3); // recede at the edges
      el.style.transform = `perspective(1500px) skewY(${sk}deg) rotateX(${rx}deg) scale(${sc})`;
    });

    // Parallax: drift each cover within its frame by its viewport position.
    parallaxImgs.forEach((img, i) => {
      img.style.setProperty('--py', `${(iData[i] * -22).toFixed(1)}px`);
    });

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ── Boot ──────────────────────────────────────────────────── */
function boot() {
  initSmoothScroll();
  initAnchors();
  initReveal();
  initCursor();
  initGallery();
  initScrollFX();
  initLoader();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
