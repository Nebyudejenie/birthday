"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { gifts } from "@/content/site";
import SectionTitle from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";
import { heartBurst } from "@/lib/celebrate";

export default function GiftBoxes() {
  const [open, setOpen] = useState<number | null>(null);
  const [unwrapped, setUnwrapped] = useState<Set<number>>(new Set());

  const reveal = (i: number) => {
    setOpen(i);
    setUnwrapped((s) => new Set(s).add(i));
    heartBurst({ x: 0.5, y: 0.5 });
  };

  return (
    <section id="gifts" className="chapter">
      <SectionTitle
        eyebrow="Chapter VII"
        script="a few little surprises"
        title="The Surprise Room"
      />

      <Reveal className="mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {gifts.map((g, i) => (
            <motion.button
              key={i}
              onClick={() => reveal(i)}
              whileHover={{ y: -6, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="glass group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl"
            >
              <motion.span
                className="text-4xl"
                animate={unwrapped.has(i) ? {} : { rotate: [0, -6, 6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: i * 0.4 }}
              >
                {unwrapped.has(i) ? g.icon : "🎁"}
              </motion.span>
              <span className="font-body text-[0.7rem] uppercase tracking-[0.2em] text-cream/55">
                {unwrapped.has(i) ? g.label : "Tap to open"}
              </span>
            </motion.button>
          ))}
        </div>
      </Reveal>

      {/* modal */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 px-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              className="glass relative w-full max-w-md rounded-3xl p-10 text-center"
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 text-5xl">{gifts[open].icon}</div>
              <p className="eyebrow mb-3">{gifts[open].label}</p>
              <h3 className="font-display text-2xl text-gilded">{gifts[open].title}</h3>
              <p className="mt-4 font-body text-base leading-relaxed text-cream/75">
                {gifts[open].body}
              </p>
              <button
                onClick={() => setOpen(null)}
                className="mt-8 font-body text-xs uppercase tracking-[0.3em] text-gold/70 transition hover:text-gold"
              >
                Close ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
