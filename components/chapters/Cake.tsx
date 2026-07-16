"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import GoldButton from "@/components/ui/GoldButton";
import Reveal from "@/components/ui/Reveal";
import { celebrate, fireworks } from "@/lib/celebrate";

type Phase = "unlit" | "lit" | "wished";

// candle x-positions, centred on the top tier (centre x = 200)
const CANDLES = [148, 174, 200, 226, 252];
const CANDLE_TOP = 150; // y of the wick
const CANDLE_BOTTOM = 202;

/** A scalloped frosting shape that domes over the top of a tier and drips
 *  down its sides. Returns an SVG path for the given tier bounds. */
function frostingPath(L: number, R: number, T: number, drips = 6) {
  const seg = (R - L) / drips;
  let d = `M ${L} ${T} Q ${(L + R) / 2} ${T - 12} ${R} ${T}`; // domed top
  d += ` L ${R} ${T + 5}`;
  for (let i = 0; i < drips; i++) {
    const x0 = R - i * seg;
    const xMid = x0 - seg / 2;
    const x1 = x0 - seg;
    const dripY = T + 15 + (i % 2 === 0 ? 9 : 2); // alternate drip length
    d += ` Q ${xMid} ${dripY} ${x1} ${T + 5}`;
  }
  d += ` L ${L} ${T} Z`;
  return d;
}

function Flame({ x, delay }: { x: number; delay: number }) {
  const top = CANDLE_TOP - 30;
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay }}
      style={{ transformBox: "fill-box", transformOrigin: "center bottom" } as React.CSSProperties}
    >
      {/* halo */}
      <circle className="flame-glow" cx={x} cy={CANDLE_TOP - 12} r={16} fill="url(#flameHalo)" />
      {/* outer flame */}
      <path
        className="flame"
        style={{ animationDelay: `${delay}s` }}
        d={`M ${x} ${top} C ${x + 8} ${top + 18} ${x + 6} ${CANDLE_TOP - 2} ${x} ${CANDLE_TOP} C ${x - 6} ${CANDLE_TOP - 2} ${x - 8} ${top + 18} ${x} ${top} Z`}
        fill="url(#flameGrad)"
      />
      {/* inner core */}
      <path
        className="flame"
        style={{ animationDelay: `${delay + 0.05}s` }}
        d={`M ${x} ${top + 10} C ${x + 3.5} ${top + 20} ${x + 3} ${CANDLE_TOP - 3} ${x} ${CANDLE_TOP - 1} C ${x - 3} ${CANDLE_TOP - 3} ${x - 3.5} ${top + 20} ${x} ${top + 10} Z`}
        fill="#fff8e6"
      />
    </motion.g>
  );
}

function Smoke({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.path
      d={`M ${x} ${CANDLE_TOP} q -6 -10 0 -20 q 6 -10 0 -20`}
      stroke="rgba(255,248,240,0.5)"
      strokeWidth={2.5}
      fill="none"
      strokeLinecap="round"
      initial={{ opacity: 0, y: 0, pathLength: 0 }}
      animate={{ opacity: [0, 0.6, 0], y: -34, pathLength: 1 }}
      transition={{ duration: 1.8, delay, ease: "easeOut" }}
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
        <motion.div
          className="relative w-[340px] max-w-[88vw]"
          animate={phase === "wished" ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 0.6 }}
        >
          <svg viewBox="0 0 400 470" className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" role="img" aria-label="A luxurious two-tier birthday cake">
            <defs>
              <linearGradient id="bodyBottom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6d3040" />
                <stop offset="100%" stopColor="#3a1a24" />
              </linearGradient>
              <linearGradient id="bodyTop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#803a4b" />
                <stop offset="100%" stopColor="#4a2230" />
              </linearGradient>
              <linearGradient id="frosting" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF6EC" />
                <stop offset="55%" stopColor="#FFE3EE" />
                <stop offset="100%" stopColor="#FFD0E0" />
              </linearGradient>
              <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F4D77E" />
                <stop offset="100%" stopColor="#C9A227" />
              </linearGradient>
              <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F4D77E" />
                <stop offset="45%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#8f6f1f" />
              </linearGradient>
              <radialGradient id="flameGrad" cx="50%" cy="78%" r="65%">
                <stop offset="0%" stopColor="#fff7cf" />
                <stop offset="45%" stopColor="#ffcf5a" />
                <stop offset="80%" stopColor="#f4820f" />
                <stop offset="100%" stopColor="#f4820f" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="flameHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffcf6a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffcf6a" stopOpacity="0" />
              </radialGradient>
              <pattern id="candleStripe" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <rect width="9" height="9" fill="#FBE9EC" />
                <rect width="4.5" height="9" fill="#B76E79" />
              </pattern>
              <radialGradient id="wishGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F4D77E" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F4D77E" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* soft wish glow when blown */}
            <AnimatePresence>
              {phase !== "unlit" && (
                <motion.ellipse
                  cx="200" cy="200" rx="200" ry="180" fill="url(#wishGlow)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            {/* ground shadow */}
            <ellipse cx="200" cy="440" rx="150" ry="15" fill="#000" opacity="0.45" />

            {/* cake stand / plate */}
            <ellipse cx="200" cy="424" rx="168" ry="22" fill="url(#plate)" />
            <ellipse cx="200" cy="420" rx="168" ry="18" fill="#2a1620" />
            <ellipse cx="200" cy="418" rx="150" ry="14" fill="#160c12" />

            {/* ── BOTTOM TIER ── */}
            <rect x="64" y="300" width="272" height="120" rx="14" fill="url(#bodyBottom)" />
            {/* sponge layer hint */}
            <rect x="64" y="352" width="272" height="7" fill="#FBE3D0" opacity="0.5" />
            {/* gold band + dots */}
            <rect x="64" y="388" width="272" height="12" fill="url(#gold)" />
            {[...Array(11)].map((_, i) => (
              <circle key={i} cx={82 + i * 23} cy={394} r={2.4} fill="#5a3c0e" opacity="0.55" />
            ))}
            {/* frosting on bottom tier */}
            <path d={frostingPath(64, 336, 300, 7)} fill="url(#frosting)" />
            {/* piped pearl border under the top tier */}
            {[...Array(9)].map((_, i) => (
              <circle key={i} cx={118 + i * 21} cy={302} r={5} fill="#FFF6EC" opacity="0.85" />
            ))}

            {/* ── TOP TIER ── */}
            <rect x="110" y="198" width="180" height="112" rx="12" fill="url(#bodyTop)" />
            <rect x="110" y="250" width="180" height="6" fill="#FBE3D0" opacity="0.45" />
            {/* frosting on top tier */}
            <path d={frostingPath(110, 290, 198, 6)} fill="url(#frosting)" />
            {/* sprinkles on the top frosting */}
            {[
              [140, 196, "#D4AF37"], [162, 200, "#B76E79"], [186, 194, "#7C3AED"],
              [210, 200, "#D4AF37"], [232, 195, "#B76E79"], [256, 199, "#F4D77E"],
              [150, 205, "#7C3AED"], [200, 206, "#F4D77E"], [246, 205, "#D4AF37"],
            ].map(([x, y, c], i) => (
              <rect key={i} x={x as number} y={y as number} width="5.5" height="2.4" rx="1.2"
                fill={c as string} transform={`rotate(${(i * 40) % 360} ${x} ${y})`} />
            ))}

            {/* ── CANDLES ── */}
            {CANDLES.map((x) => (
              <g key={x}>
                <rect x={x - 3.5} y={CANDLE_TOP} width="7" height={CANDLE_BOTTOM - CANDLE_TOP} rx="3" fill="url(#candleStripe)" />
                <rect x={x - 3.5} y={CANDLE_TOP} width="3" height={CANDLE_BOTTOM - CANDLE_TOP} rx="2" fill="#fff" opacity="0.18" />
                {/* wick */}
                <line x1={x} y1={CANDLE_TOP} x2={x} y2={CANDLE_TOP - 5} stroke="#3a2a1a" strokeWidth="1.6" strokeLinecap="round" />
              </g>
            ))}

            {/* ── FLAMES / SMOKE ── */}
            <AnimatePresence>
              {phase === "lit" && CANDLES.map((x, i) => <Flame key={x} x={x} delay={i * 0.08} />)}
            </AnimatePresence>
            {phase === "wished" && CANDLES.map((x, i) => <Smoke key={x} x={x} delay={i * 0.06} />)}
          </svg>
        </motion.div>

        {/* controls */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {phase === "unlit" && (
              <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GoldButton onClick={light}>Light The Candles ✦</GoldButton>
              </motion.div>
            )}
            {phase === "lit" && (
              <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                <GoldButton onClick={wish}>Make A Wish &amp; Blow ✦</GoldButton>
                <span className="font-body text-xs tracking-[0.25em] text-cream/40">close your eyes first…</span>
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
