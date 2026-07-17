"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { reasons, compliments } from "@/content/site";
import SectionTitle from "@/components/ui/SectionTitle";
import GoldButton from "@/components/ui/GoldButton";
import Reveal from "@/components/ui/Reveal";

/** Deterministic PRNG so star positions match on server and client. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ReasonsSky() {
  const [active, setActive] = useState<number | null>(null);
  const [compliment, setCompliment] = useState<string | null>(null);

  const stars = useMemo(() => {
    const rnd = mulberry32(2107); // 21/07 :)
    return reasons.map((text, i) => ({
      text,
      i,
      x: 6 + rnd() * 88,
      y: 8 + rnd() * 82,
      size: 0.7 + rnd() * 0.9,
      delay: rnd() * 3,
    }));
  }, []);

  const surprise = () => {
    let next = compliment;
    while (next === compliment && compliments.length > 1) {
      next = compliments[Math.floor(Math.random() * compliments.length)];
    }
    setCompliment(next ?? compliments[0]);
  };

  return (
    <section id="reasons" className="chapter">
      <SectionTitle
        eyebrow="Chapter IV"
        script="each one is a star"
        title="Why You're Amazing"
      />

      <Reveal className="mx-auto max-w-4xl">
        <p className="mb-6 text-center font-body text-sm text-cream/50">
          Every star is a reason. Touch one.
        </p>

        <div className="glass relative h-[420px] w-full overflow-hidden rounded-3xl">
          {stars.map((s) => (
            <button
              key={s.i}
              onClick={() => setActive(s.i)}
              /* the star stays delicate, but the tap area is a full 24px
                 (WCAG 2.2 target size) centred on it */
              className="group absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              aria-label={`Reason ${s.i + 1}`}
            >
              <motion.span
                className="block rounded-full bg-gold-bright"
                style={{
                  width: `${s.size * 8}px`,
                  height: `${s.size * 8}px`,
                  boxShadow: "0 0 14px rgba(244,215,126,0.9)",
                }}
                animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.25, 1] }}
                transition={{ duration: 2.6, delay: s.delay, repeat: Infinity }}
                whileHover={{ scale: 1.8 }}
              />
            </button>
          ))}

          {/* revealed reason */}
          <AnimatePresence>
            {active !== null && (
              <motion.button
                key="reveal"
                onClick={() => setActive(null)}
                className="absolute inset-0 flex items-center justify-center bg-ink/70 px-8 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.p
                  initial={{ scale: 0.9, y: 10, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  className="max-w-lg text-center font-display text-3xl italic text-gilded sm:text-4xl"
                >
                  {reasons[active]}
                </motion.p>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* compliment generator */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <GoldButton onClick={surprise}>Tell Me Something Sweet ✦</GoldButton>
          <AnimatePresence mode="wait">
            {compliment && (
              <motion.p
                key={compliment}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12 }}
                className="max-w-md text-center font-script text-3xl text-rose"
              >
                {compliment}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
