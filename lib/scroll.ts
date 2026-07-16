import type Lenis from "lenis";

/** Smoothly scroll to an element id, using Lenis when available. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
