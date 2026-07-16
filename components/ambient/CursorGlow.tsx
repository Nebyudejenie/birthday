"use client";

import { useEffect, useRef } from "react";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * A soft golden light that follows the cursor (desktop only), plus a tiny
 * trailing spark. Eased for a luxurious lag.
 */
export default function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (touch || reduced) return;
    const el = glow.current;
    if (!el) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [touch, reduced]);

  if (touch || reduced) return null;

  return (
    <div
      ref={glow}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[3] h-80 w-80 rounded-full mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(212,175,55,0.16), rgba(183,110,121,0.08) 40%, transparent 70%)",
      }}
    />
  );
}
