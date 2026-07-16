"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useMounted, usePrefersReducedMotion } from "@/lib/hooks";

type Variant = "morpho" | "glasswing";

/* ── Wing artwork (top-down). Wings sit in a <g class="bf-wings"> so the
   shared CSS keyframe makes them flap symmetrically. ── */

function MorphoWings() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
      <defs>
        <radialGradient id="morphoUpper" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#8fd0ff" />
          <stop offset="45%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#132a63" />
        </radialGradient>
        <radialGradient id="morphoLower" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#5aa9ff" />
          <stop offset="100%" stopColor="#0f1f4a" />
        </radialGradient>
      </defs>
      {/* body */}
      <ellipse cx="50" cy="52" rx="2.4" ry="20" fill="#1a1206" />
      <circle cx="50" cy="30" r="3.2" fill="#1a1206" />
      {/* antennae */}
      <path d="M50 29 Q45 16 40 13" stroke="#1a1206" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M50 29 Q55 16 60 13" stroke="#1a1206" strokeWidth="1.1" fill="none" strokeLinecap="round" />

      <g className="bf-wings">
        {/* left wings */}
        <path d="M49 40 C28 20 4 26 8 44 C10 58 34 56 49 50 Z" fill="url(#morphoUpper)" stroke="#0a163a" strokeWidth="1" />
        <path d="M49 54 C34 58 14 66 20 78 C26 86 44 74 49 64 Z" fill="url(#morphoLower)" stroke="#0a163a" strokeWidth="1" />
        {/* right wings */}
        <path d="M51 40 C72 20 96 26 92 44 C90 58 66 56 51 50 Z" fill="url(#morphoUpper)" stroke="#0a163a" strokeWidth="1" />
        <path d="M51 54 C66 58 86 66 80 78 C74 86 56 74 51 64 Z" fill="url(#morphoLower)" stroke="#0a163a" strokeWidth="1" />
        {/* edge speckles */}
        <g fill="#eaf4ff" opacity="0.8">
          <circle cx="12" cy="42" r="1" />
          <circle cx="18" cy="47" r="0.9" />
          <circle cx="88" cy="42" r="1" />
          <circle cx="82" cy="47" r="0.9" />
        </g>
      </g>
    </svg>
  );
}

function GlasswingWings() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id="glassTip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B76E79" />
          <stop offset="100%" stopColor="#8a4f58" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="52" rx="2" ry="18" fill="#2a1c14" />
      <circle cx="50" cy="32" r="2.8" fill="#2a1c14" />
      <path d="M50 31 Q46 18 41 15" stroke="#2a1c14" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M50 31 Q54 18 59 15" stroke="#2a1c14" strokeWidth="1" fill="none" strokeLinecap="round" />

      <g className="bf-wings">
        {/* left */}
        <path d="M49 41 C30 23 8 30 11 45 C13 57 34 55 49 50 Z" fill="rgba(255,248,240,0.14)" stroke="#3a2a2a" strokeWidth="1" />
        <path d="M49 54 C35 58 17 66 22 77 C27 85 44 73 49 63 Z" fill="rgba(255,248,240,0.12)" stroke="#3a2a2a" strokeWidth="1" />
        <path d="M14 30 C9 33 8 40 11 45 Z" fill="url(#glassTip)" opacity="0.9" />
        {/* right */}
        <path d="M51 41 C70 23 92 30 89 45 C87 57 66 55 51 50 Z" fill="rgba(255,248,240,0.14)" stroke="#3a2a2a" strokeWidth="1" />
        <path d="M51 54 C65 58 83 66 78 77 C73 85 56 73 51 63 Z" fill="rgba(255,248,240,0.12)" stroke="#3a2a2a" strokeWidth="1" />
        <path d="M86 30 C91 33 92 40 89 45 Z" fill="url(#glassTip)" opacity="0.9" />
      </g>
    </svg>
  );
}

type Config = {
  variant: Variant;
  dir: 1 | -1;
  startY: number; // fraction of viewport height
  drift: number; // vertical wander amplitude (px)
  size: number; // px
  duration: number;
  delay: number;
  flap: number; // seconds per flap
};

function Butterfly({ cfg, w, h }: { cfg: Config; w: number; h: number }) {
  const startX = cfg.dir > 0 ? -80 : w + 80;
  const endX = cfg.dir > 0 ? w + 80 : -80;
  const baseY = cfg.startY * h;

  // a gently wandering horizontal crossing with vertical bobbing
  const xs = [startX, w * 0.3, w * 0.55, w * 0.75, endX];
  const ys = [
    baseY,
    baseY - cfg.drift,
    baseY + cfg.drift * 0.6,
    baseY - cfg.drift * 0.4,
    baseY + cfg.drift * 0.3,
  ];
  const rot = [0, cfg.dir > 0 ? 8 : -8, -4, 6, 0];

  return (
    <motion.div
      className="absolute left-0 top-0 will-change-transform"
      style={{ width: cfg.size, height: cfg.size }}
      initial={{ x: startX, y: baseY, opacity: 0 }}
      animate={{ x: xs, y: ys, rotate: rot, opacity: [0, 1, 1, 1, 0] }}
      transition={{
        duration: cfg.duration,
        delay: cfg.delay,
        repeat: Infinity,
        repeatDelay: 4 + Math.random() * 6,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: cfg.dir > 0 ? "scaleX(1)" : "scaleX(-1)",
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
        }}
      >
        {/* per-butterfly flap speed cascades into .bf-wings via --flap */}
        <div style={{ width: "100%", height: "100%", ["--flap" as string]: `${cfg.flap}s` }}>
          {cfg.variant === "morpho" ? <MorphoWings /> : <GlasswingWings />}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Two Blue Morphos and two Glasswings drifting across the whole page,
 * wings flapping. Purely decorative; disabled for reduced-motion.
 */
export default function Butterflies() {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const flock = useMemo<Config[]>(
    () => [
      { variant: "morpho", dir: 1, startY: 0.22, drift: 70, size: 44, duration: 26, delay: 1, flap: 0.3 },
      { variant: "glasswing", dir: -1, startY: 0.5, drift: 90, size: 38, duration: 32, delay: 5, flap: 0.36 },
      { variant: "morpho", dir: -1, startY: 0.72, drift: 60, size: 40, duration: 30, delay: 9, flap: 0.28 },
      { variant: "glasswing", dir: 1, startY: 0.86, drift: 55, size: 34, duration: 28, delay: 14, flap: 0.34 },
    ],
    [],
  );

  if (!mounted || reduced || size.w === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {flock.map((cfg, i) => (
        <Butterfly key={i} cfg={cfg} w={size.w} h={size.h} />
      ))}
    </div>
  );
}
