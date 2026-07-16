"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import GoldButton from "@/components/ui/GoldButton";
import Reveal from "@/components/ui/Reveal";
import { celebrate, fireworks } from "@/lib/celebrate";

type Phase = "unlit" | "lit" | "wished";

const CANDLES = [0, 1, 2, 3, 4];

function Flame() {
  return (
    <motion.div
      className="absolute -top-4 left-1/2 h-5 w-2.5 -translate-x-1/2 rounded-full"
      style={{
        background: "radial-gradient(circle at 50% 70%, #fff7cf, #f4a020 60%, transparent 78%)",
        boxShadow: "0 -2px 18px 5px rgba(244,160,32,0.6)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        scaleY: [1, 1.2, 0.95, 1.1, 1],
        scaleX: [1, 0.9, 1.05, 0.95, 1],
      }}
      exit={{ scale: 0, opacity: 0, y: -12 }}
      transition={{ scaleY: { duration: 1.2, repeat: Infinity }, scaleX: { duration: 1.2, repeat: Infinity } }}
    />
  );
}

export default function Cake() {
  const [phase, setPhase] = useState<Phase>("unlit");

  const light = () => setPhase("lit");
  const wish = () => {
    setPhase("wished");
    celebrate();
    setTimeout(() => fireworks(3500), 250);
  };

  return (
    <section id="cake" className="chapter">
      <SectionTitle eyebrow="Chapter VI" script="make a wish" title="Your Birthday Cake" />

      <Reveal className="flex flex-col items-center">
        <div className="relative mb-12 h-56 w-72" aria-label="A birthday cake">
          {/* candles */}
          <div className="absolute left-1/2 top-0 flex -translate-x-1/2 gap-5">
            {CANDLES.map((c) => (
              <div key={c} className="relative h-16 w-2.5 rounded-sm bg-gradient-to-b from-rose-soft to-rose">
                <AnimatePresence>{phase === "lit" && <Flame key="f" />}</AnimatePresence>
                {/* smoke after blow */}
                <AnimatePresence>
                  {phase === "wished" && (
                    <motion.div
                      className="absolute -top-3 left-1/2 h-6 w-1.5 -translate-x-1/2 rounded-full bg-cream/30 blur-[2px]"
                      initial={{ opacity: 0.6, y: 0, scaleY: 1 }}
                      animate={{ opacity: 0, y: -40, scaleY: 2.5 }}
                      transition={{ duration: 1.6, delay: c * 0.05 }}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* tiers */}
          <div className="absolute bottom-0 left-1/2 w-full -translate-x-1/2">
            <div className="mx-auto h-16 w-44 rounded-t-xl"
              style={{ background: "linear-gradient(180deg,#2a1c22,#1a1216)", boxShadow: "inset 0 2px 0 rgba(212,175,55,0.3)" }}
            >
              <div className="mx-auto mt-2 h-2 w-40 rounded-full bg-rose/60" />
            </div>
            <div className="mx-auto -mt-1 h-20 w-64 rounded-t-xl"
              style={{ background: "linear-gradient(180deg,#32232a,#20161b)", boxShadow: "inset 0 2px 0 rgba(212,175,55,0.3)" }}
            >
              <div className="mx-auto mt-2 flex justify-center gap-3">
                {[...Array(7)].map((_, i) => (
                  <span key={i} className="mt-1 h-2 w-2 rounded-full bg-gold/70" />
                ))}
              </div>
            </div>
            {/* plate */}
            <div className="mx-auto -mt-1 h-3 w-72 rounded-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {phase === "unlit" && (
              <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GoldButton onClick={light}>Light The Candles ✦</GoldButton>
              </motion.div>
            )}
            {phase === "lit" && (
              <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GoldButton onClick={wish}>Make A Wish &amp; Blow ✦</GoldButton>
              </motion.div>
            )}
            {phase === "wished" && (
              <motion.p
                key="c"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center font-script text-4xl text-gilded"
              >
                Your wish is on its way ✨
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
