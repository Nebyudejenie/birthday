"use client";

import { useEffect, useRef } from "react";
import { audioSignals } from "@/lib/audioStore";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * A soft, full-screen golden bloom that breathes with the music — brighter
 * on swells, near-invisible when the song is calm. Elegant and restrained;
 * reads the shared audio signal directly so it never re-renders React.
 */
export default function AudioGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let eased = 0;
    const loop = () => {
      eased += (audioSignals.intensity - eased) * 0.08;
      el.style.opacity = String(0.04 + eased * 0.5);
      el.style.transform = `scale(${1 + eased * 0.12})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-0 mix-blend-screen"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(212,175,55,0.5), rgba(183,110,121,0.18) 45%, transparent 70%)",
      }}
    />
  );
}
