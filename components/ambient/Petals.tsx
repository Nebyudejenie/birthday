"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { audioSignals } from "@/lib/audioStore";

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  rot: number;
  vr: number;
  sway: number;
  swaySpeed: number;
  hue: number;
  alpha: number;
};

/**
 * Rose petals drifting down the whole page. Drawn as soft teardrop
 * shapes in rose-gold tones, gently swaying as they fall.
 */
export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let petals: Petal[] = [];

    const palette = [
      [183, 110, 121], // rose gold
      [255, 214, 231], // soft pink
      [212, 175, 55], // gold
      [255, 248, 240], // cream
    ];

    const make = (): Petal => {
      return {
        x: Math.random() * w,
        y: Math.random() * -h,
        size: Math.random() * 9 + 6,
        speed: Math.random() * 0.35 + 0.15,
        drift: Math.random() * 0.3 - 0.15,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.02,
        sway: Math.random() * 40 + 20,
        swaySpeed: Math.random() * 0.001 + 0.0005,
        hue: Math.floor(Math.random() * palette.length),
        alpha: Math.random() * 0.4 + 0.35,
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(34, Math.floor(w / 42));
      petals = Array.from({ length: count }, make);
    };

    const drawPetal = (p: Petal, t: number) => {
      const [r, g, b] = palette[p.hue];
      const swayX = Math.sin(t * p.swaySpeed + p.y * 0.01) * p.sway;
      ctx.save();
      ctx.translate(p.x + swayX, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha * (0.85 + audioSignals.intensity * 0.5);
      const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0.35)`);
      ctx.fillStyle = grad;
      // teardrop / petal shape
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size, -p.size * 0.4, p.size * 0.6, p.size, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.6, p.size, -p.size, -p.size * 0.4, 0, -p.size);
      ctx.fill();
      ctx.restore();
    };

    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = now - last;
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.y += p.speed * dt * 0.06;
        p.x += p.drift * dt * 0.06;
        p.rot += p.vr * dt * 0.06;
        if (p.y > h + p.size * 2) {
          Object.assign(p, make(), { y: -p.size * 2 });
        }
        drawPetal(p, now);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[1]" />
  );
}
