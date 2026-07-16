"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { prayer, verses } from "@/content/site";
import SectionTitle from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";

function Candle({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex flex-col items-center">
      {/* flame */}
      <motion.div
        className="relative h-6 w-3 rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 70%, #fff7cf, #f4a020 60%, transparent 75%)",
          boxShadow: "0 -2px 24px 6px rgba(244,160,32,0.45)",
        }}
        animate={{ scaleY: [1, 1.18, 0.95, 1.1, 1], scaleX: [1, 0.92, 1.05, 0.96, 1], opacity: [0.9, 1, 0.85, 1] }}
        transition={{ duration: 1.4, delay, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* body */}
      <div className="mt-1 h-16 w-4 rounded-sm bg-gradient-to-b from-cream to-[#d8c9a8]" />
    </div>
  );
}

export default function Prayer() {
  const [vi, setVi] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setVi((i) => (i + 1) % verses.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="prayer" className="chapter">
      <SectionTitle eyebrow="Chapter V" script="be still" title="A Prayer For You" />

      <Reveal className="mx-auto max-w-3xl">
        {/* sanctuary light */}
        <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-full w-2/3 -translate-x-1/2 opacity-40"
            style={{ background: "linear-gradient(180deg,rgba(244,215,126,0.35),transparent 70%)" }}
          />

          {/* candles */}
          <div className="relative mb-10 flex items-end justify-center gap-8">
            <Candle delay={0} />
            <Candle delay={0.5} />
            <Candle delay={0.25} />
          </div>

          {/* prayer */}
          <div className="relative space-y-3 text-center">
            {prayer.lines.map((l, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.25, duration: 0.9 }}
                className={
                  i === 0 || i === prayer.lines.length - 1
                    ? "font-display text-2xl italic text-gilded"
                    : "font-body text-base leading-relaxed text-cream/75"
                }
              >
                {l}
              </motion.p>
            ))}
          </div>
        </div>

        {/* rotating verse */}
        <div className="mt-10 flex min-h-[9rem] items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.figure
              key={vi}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-center"
            >
              <blockquote className="font-display text-lg italic leading-relaxed text-cream/85 sm:text-xl">
                {verses[vi].text}
              </blockquote>
              <figcaption className="mt-4 font-body text-xs uppercase tracking-[0.4em] text-gold">
                {verses[vi].ref}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
