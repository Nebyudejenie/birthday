"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { audioSignals } from "@/lib/audioStore";

type Star = { x: number; y: number; r: number; base: number; tw: number; ph: number };
type Shoot = { x: number; y: number; vx: number; vy: number; life: number; len: number };

/**
 * A living night sky: twinkling golden stars on a canvas, with the
 * occasional shooting star crossing the frame.
 */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const shooters: Shoot[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(220, Math.floor((w * h) / 7000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.5 + 0.3,
        tw: Math.random() * 0.5 + 0.2,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    let last = performance.now();
    let raf = 0;
    let nextShoot = 2500 + Math.random() * 3500;

    const frame = (now: number) => {
      const dt = now - last;
      last = now;
      ctx.clearRect(0, 0, w, h);

      // twinkling stars — brighten gently with the music
      const boost = audioSignals.intensity * 0.35;
      for (const s of stars) {
        s.ph += (s.tw * dt) / 1000;
        const a = s.base + Math.sin(s.ph) * (0.3 + boost) + boost * 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 244, 214, ${Math.max(0, a)})`;
        ctx.fill();
      }

      // spawn shooting stars occasionally
      nextShoot -= dt;
      if (nextShoot <= 0 && shooters.length < 2) {
        const fromLeft = Math.random() > 0.5;
        const speed = 0.35 + Math.random() * 0.25;
        shooters.push({
          x: fromLeft ? -40 : w + 40,
          y: Math.random() * h * 0.5,
          vx: (fromLeft ? 1 : -1) * speed,
          vy: 0.18 * speed * 3,
          life: 1,
          len: 120 + Math.random() * 100,
        });
        nextShoot = 4000 + Math.random() * 6000;
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const m = shooters[i];
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life -= dt / 900;
        if (m.life <= 0 || m.x < -80 || m.x > w + 80) {
          shooters.splice(i, 1);
          continue;
        }
        const tailX = m.x - m.vx * m.len;
        const tailY = m.y - m.vy * m.len;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(244, 215, 126, ${m.life})`);
        grad.addColorStop(1, "rgba(244, 215, 126, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,244,214,${s.base})`;
        ctx.fill();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
