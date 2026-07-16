"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { loveLetter } from "@/content/site";
import SectionTitle from "@/components/ui/SectionTitle";

export default function LoveLetter() {
  const [open, setOpen] = useState(false);

  return (
    <section id="letter" className="chapter">
      <SectionTitle eyebrow="Chapter I" script="a note for you" title="Open My Heart" />

      <div className="flex flex-col items-center">
        {/* Envelope */}
        <AnimatePresence mode="wait">
          {!open && (
            <motion.button
              key="envelope"
              onClick={() => setOpen(true)}
              className="group relative h-56 w-80 cursor-pointer sm:h-64 sm:w-[26rem]"
              aria-label="Open the letter"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
              whileHover={{ y: -6 }}
            >
              {/* body */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: "linear-gradient(160deg,#17151a,#0d0c10)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  boxShadow: "0 30px 70px -30px rgba(0,0,0,0.9)",
                }}
              />
              {/* flap */}
              <div
                className="absolute inset-x-0 top-0 origin-top"
                style={{
                  height: "60%",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(160deg,#1f1c22,#141217)",
                  borderBottom: "1px solid rgba(212,175,55,0.25)",
                }}
              />
              {/* wax seal */}
              <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #a11226, #6d071a 70%)",
                  boxShadow: "0 0 30px -6px rgba(183,110,121,0.7), inset 0 2px 6px rgba(255,255,255,0.15)",
                }}
              >
                <span className="font-script text-2xl text-cream/90">
                  {loveLetter.signature[0]}
                </span>
              </div>
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-body text-xs uppercase tracking-[0.3em] text-gold/70">
                tap to open
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Letter */}
        <AnimatePresence>
          {open && (
            <motion.article
              key="letter"
              initial={{ opacity: 0, y: 40, rotateX: -12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl p-8 sm:p-12"
              style={{
                background: "linear-gradient(180deg,#fdf6ea,#f3e7d2)",
                boxShadow: "0 40px 90px -40px rgba(0,0,0,0.85)",
                color: "#2a2015",
              }}
            >
              {/* paper texture lines */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg,#6d071a 0,#6d071a 1px,transparent 1px,transparent 32px)",
                }}
              />
              <motion.p
                className="font-script text-4xl text-burgundy sm:text-5xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {loveLetter.greeting}
              </motion.p>

              <div className="mt-6 space-y-5">
                {loveLetter.body.map((para, i) => (
                  <motion.p
                    key={i}
                    className="font-body text-[0.98rem] leading-relaxed text-[#3a2c1c]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.6, duration: 0.9 }}
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

              <motion.p
                className="mt-8 font-display text-lg italic text-burgundy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + loveLetter.body.length * 0.6, duration: 0.9 }}
              >
                {loveLetter.closing}
              </motion.p>
              <motion.p
                className="mt-4 text-right font-script text-4xl text-burgundy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + loveLetter.body.length * 0.6, duration: 1 }}
              >
                {loveLetter.signature}
              </motion.p>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
