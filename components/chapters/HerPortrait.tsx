"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { portrait } from "@/content/site";
import Reveal from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * "Her Entrance" — the portrait chapter.
 *
 * Curation notes: this is the single strongest image, so it gets one large,
 * uninterrupted stage rather than being repeated around the site. The photo
 * already carries a warm rim-light and a terracotta backdrop that match the
 * site palette, so the treatment *echoes* it instead of recolouring it:
 *   · a thin double gold rule (a gallery mat, not a heavy border)
 *   · a rose-gold bloom that continues the existing hair light
 *   · a very slow Ken Burns push-in, so the frame breathes
 *   · a blur-reveal + single light sweep on entry
 *   · mouse parallax for depth (desktop only, disabled for reduced motion)
 *   · a whisper of cinematic grade in CSS — non-destructive, original intact
 *
 * If the image file is absent the whole section removes itself silently.
 */
export default function HerPortrait() {
  const [failed, setFailed] = useState(false);
  const reduced = usePrefersReducedMotion();

  // subtle mouse parallax on the frame
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 });

  const onMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // no photo yet (or it failed to load) → this chapter simply doesn't exist
  if (!portrait.src || failed) return null;

  return (
    <section id="portrait" className="chapter">
      <Reveal className="mb-10 text-center">
        {portrait.script && (
          <p className="font-script text-3xl text-rose sm:text-4xl">{portrait.script}</p>
        )}
        <h2 className="mx-auto max-w-3xl text-balance font-display text-3xl font-semibold leading-tight text-gilded sm:text-4xl md:text-5xl">
          {portrait.title}
        </h2>
        <div className="hairline mx-auto mt-6 w-40" />
      </Reveal>

      <div className="flex flex-col items-center" onMouseMove={onMouse} onMouseLeave={onLeave}>
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
          className="relative w-full max-w-[340px] sm:max-w-[400px]"
          initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(16px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Rose-gold bloom continuing her hair light. The bleed is tightened on
              narrow screens: at 320px a 40px bleed pushed the box past the
              viewport and created real horizontal scroll. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 -z-10 rounded-full blur-3xl sm:-inset-10"
            style={{
              background:
                "radial-gradient(ellipse at 60% 35%, rgba(212,175,55,0.35), rgba(183,110,121,0.22) 45%, transparent 70%)",
            }}
          />

          {/* the gallery mat: thin double gold rule */}
          <div
            className="relative rounded-[1.6rem] p-[1.5px]"
            style={{
              background: "linear-gradient(150deg, #F4D77E, #B76E79 40%, #6D071A 75%, #D4AF37)",
              boxShadow: "0 40px 90px -40px rgba(0,0,0,0.9), 0 0 60px -18px rgba(212,175,55,0.4)",
            }}
          >
            <div className="rounded-[1.5rem] bg-ink p-2 sm:p-2.5">
              <div className="relative overflow-hidden rounded-[1.1rem]">
                {/* the photograph */}
                <motion.img
                  src={portrait.src}
                  alt={portrait.alt}
                  onError={() => setFailed(true)}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover"
                  style={{
                    aspectRatio: "4 / 5",
                    objectPosition: portrait.objectPosition,
                    // a whisper of cinematic grade — the original is untouched
                    filter: "contrast(1.04) saturate(1.06) brightness(1.02)",
                  }}
                  // Ken Burns: a slow, barely-perceptible push-in
                  animate={reduced ? {} : { scale: [1, 1.06, 1] }}
                  transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* warm grade wash + bottom vignette so the caption stays readable */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(109,7,26,0.10) 0%, transparent 35%, transparent 60%, rgba(5,5,5,0.55) 100%)",
                  }}
                />

                {/* a single light sweep as the frame arrives */}
                {!reduced && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 w-1/2"
                    style={{
                      background:
                        "linear-gradient(100deg, transparent, rgba(255,248,240,0.28), transparent)",
                    }}
                    initial={{ x: "-150%" }}
                    whileInView={{ x: "260%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, delay: 0.9, ease: "easeInOut" }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* corner flourishes */}
          {[
            "left-3 top-3 border-l border-t",
            "right-3 top-3 border-r border-t",
            "left-3 bottom-3 border-b border-l",
            "right-3 bottom-3 border-b border-r",
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`pointer-events-none absolute h-5 w-5 rounded-[3px] border-gold/50 ${pos}`}
            />
          ))}
        </motion.div>

        {/* caption */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-8 max-w-xl text-balance text-center font-display text-base italic leading-relaxed text-cream/75 sm:text-lg"
        >
          {portrait.caption}
        </motion.p>
      </div>
    </section>
  );
}
