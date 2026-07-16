"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { site } from "@/content/site";
import { useAudio } from "@/components/audio/AudioProvider";

type Phase = "await" | "igniting";

/**
 * The cinematic entry. Holds on black until the user chooses to "Begin
 * Experience ❤️" (which starts the music inside the gesture), then plays a
 * movie-opening sequence — golden particles → heart → title — before
 * revealing the hero.
 *
 * Timeline after click:
 *   0s black · 1s particles · 2s heart · 3s music/title · ~3.8s reveal
 */
export default function Intro({ onReveal }: { onReveal: () => void }) {
  const audio = useAudio();
  const [phase, setPhase] = useState<Phase>("await");
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  // reveal the button once fonts are ready (avoids a flash of the wrong font)
  useEffect(() => {
    const fonts =
      typeof document !== "undefined" && "fonts" in document
        ? (document as Document & { fonts: FontFaceSet }).fonts.ready
        : Promise.resolve();
    Promise.all([fonts, new Promise((r) => setTimeout(r, 700))]).then(() => setReady(true));
  }, []);

  const begin = () => {
    if (phase !== "await") return;
    audio.begin(); // must run inside the gesture
    setPhase("igniting");
    setTimeout(() => setGone(true), 3600); // play the opening, then dissolve
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        x: 50 + (Math.cos((i / 26) * Math.PI * 2) * (18 + (i % 5) * 6)),
        y: 50 + (Math.sin((i / 26) * Math.PI * 2) * (16 + (i % 4) * 6)),
        d: (i % 7) * 0.12,
        s: 2 + (i % 3),
      })),
    [],
  );

  return (
    <AnimatePresence onExitComplete={onReveal}>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink"
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
        >
          {/* golden particles (appear ~1s into ignition) */}
          {phase === "igniting" &&
            particles.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-gold-bright"
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.5], scale: [0, 1.4, 1], y: [-4, 4, -4] }}
                transition={{ delay: 1 + p.d, duration: 2.2, repeat: Infinity, repeatType: "reverse" }}
              />
            ))}

          <div className="relative flex flex-col items-center px-6 text-center">
            {/* heart (grows ~2s into ignition) */}
            <AnimatePresence>
              {phase === "igniting" && (
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                  transition={{ delay: 1.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.svg
                    width="72" height="72" viewBox="0 0 64 64"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ delay: 2.6, duration: 1.1, repeat: Infinity }}
                    className="drop-glow"
                  >
                    <defs>
                      <linearGradient id="introHeart" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#F4D77E" />
                        <stop offset="1" stopColor="#B76E79" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#introHeart)" d="M32 56S6 40 6 22.5C6 14 12 9 19 9c5 0 9.5 3 13 8 3.5-5 8-8 13-8 7 0 13 5 13 13.5C58 40 32 56 32 56z" />
                  </motion.svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* title */}
            <motion.p
              className="font-script text-5xl text-gilded sm:text-6xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {site.recipient}
            </motion.p>

            <AnimatePresence mode="wait">
              {phase === "await" ? (
                <motion.div
                  key="await"
                  className="mt-8 flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: ready ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button
                    onClick={begin}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="group relative overflow-hidden rounded-full px-9 py-4 font-body text-sm font-medium uppercase tracking-[0.22em] text-cream"
                    style={{
                      background: "linear-gradient(180deg, rgba(212,175,55,0.18), rgba(19,19,22,0.6))",
                      border: "1px solid rgba(212,175,55,0.6)",
                      boxShadow: "0 0 50px -10px rgba(212,175,55,0.55)",
                    }}
                  >
                    <span className="relative z-10">Begin Experience ❤️</span>
                    <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,248,240,0.35),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
                  </motion.button>
                  <p className="mt-5 font-body text-[0.62rem] uppercase tracking-[0.4em] text-cream/35">
                    turn your sound on
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="ign"
                  className="mt-4 font-display text-lg italic text-cream/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.8, duration: 1 }}
                >
                  {site.queenLine}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
