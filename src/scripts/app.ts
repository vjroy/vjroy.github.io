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
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
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
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
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
  if (!finePointer || reduceMotion || !el || !dot || !ring) {
    el?.remove();
    return;
  }

  document.body.classList.add('has-cursor');
  let mx = window.innerWidth / 2,
    my = window.innerHeight / 2;
  let rx = mx,
    ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    document.body.classList.add('cursor-ready');
  });

  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const hoverTargets = '[data-cursor], [data-cursor-card], a, button';
  document.querySelectorAll<HTMLElement>(hoverTargets).forEach((t) => {
    t.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    t.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
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

/* ── Boot ──────────────────────────────────────────────────── */
function boot() {
  initSmoothScroll();
  initAnchors();
  initReveal();
  initCursor();
  initGallery();
  initLoader();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
