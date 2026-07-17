"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site, distanceLines } from "@/content/site";
import SectionTitle from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Live clock for a given IANA timezone. */
function useClock(tz: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: tz,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000 * 20);
    return () => clearInterval(id);
  }, [tz]);
  return time;
}

function CityClock({
  flag,
  city,
  region,
  time,
  align,
}: {
  flag: string;
  city: string;
  region: string;
  time: string;
  align: "left" | "right";
}) {
  return (
    <div className={align === "left" ? "text-left" : "text-right"}>
      <p className="font-display text-xl text-cream sm:text-2xl">
        {flag} {city}
      </p>
      {region && <p className="font-body text-xs tracking-widest text-cream/45">{region}</p>}
      <p className="mt-1 font-body text-sm tabular-nums text-gold">{time}</p>
    </div>
  );
}

export default function DistanceGlobe() {
  const herTime = useClock("America/New_York"); // Cleveland
  const youTime = useClock("Africa/Addis_Ababa"); // Addis Ababa
  const [lineIdx, setLineIdx] = useState(0);
  // SMIL <animate> tags are reached by neither the CSS reduced-motion
  // kill-switch nor MotionConfig, so we gate them ourselves.
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const id = setInterval(
      () => setLineIdx((i) => (i + 1) % distanceLines.length),
      3600,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section id="distance" className="chapter">
      <SectionTitle
        eyebrow="Chapter II"
        script="two skies, one moon"
        title="Across The Miles"
      />

      <Reveal className="mx-auto max-w-3xl">
        {/* Clocks */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <CityClock
            flag={site.places.you.flag}
            city={site.places.you.city}
            region={site.places.you.country}
            time={youTime}
            align="left"
          />
          <CityClock
            flag={site.places.her.flag}
            city={site.places.her.city}
            region={`${site.places.her.region}, ${site.places.her.country}`}
            time={herTime}
            align="right"
          />
        </div>

        {/* Globe + beam */}
        <div className="glass rounded-3xl p-4 sm:p-8">
          <svg viewBox="0 0 800 420" className="w-full" role="img" aria-label="A golden beam of light connecting two cities across the globe">
            <defs>
              <radialGradient id="globeFill" cx="42%" cy="38%" r="70%">
                <stop offset="0%" stopColor="#1a1f2e" />
                <stop offset="70%" stopColor="#0b0d14" />
                <stop offset="100%" stopColor="#060709" />
              </radialGradient>
              <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#B76E79" />
                <stop offset="50%" stopColor="#F4D77E" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
              <radialGradient id="markerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F4D77E" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F4D77E" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* globe */}
            <circle cx="400" cy="230" r="180" fill="url(#globeFill)" stroke="rgba(212,175,55,0.35)" strokeWidth="1" />
            {/* meridians */}
            {[40, 90, 140].map((rx) => (
              <ellipse key={rx} cx="400" cy="230" rx={rx} ry="180" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="1" />
            ))}
            {[60, 120].map((ry) => (
              <ellipse key={ry} cx="400" cy="230" rx="180" ry={ry} fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="1" />
            ))}
            <ellipse cx="400" cy="230" rx="180" ry="0.5" fill="none" stroke="rgba(212,175,55,0.18)" strokeWidth="1" />

            {/* the arc between cities */}
            <path
              id="loveArc"
              d="M 250 300 Q 400 40 560 200"
              fill="none"
              stroke="url(#beam)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="6 10"
            >
              {!reduced && (
                <animate attributeName="stroke-dashoffset" from="0" to="-160" dur="3s" repeatCount="indefinite" />
              )}
            </path>

            {/* markers */}
            {/* Addis */}
            <circle cx="250" cy="300" r="26" fill="url(#markerGlow)" />
            <circle cx="250" cy="300" r="5" fill="#F4D77E">
              {!reduced && <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />}
            </circle>
            {/* Cleveland */}
            <circle cx="560" cy="200" r="26" fill="url(#markerGlow)" />
            <circle cx="560" cy="200" r="5" fill="#F4D77E">
              {!reduced && <animate attributeName="r" values="4;6;4" dur="2s" begin="1s" repeatCount="indefinite" />}
            </circle>

            {/* traveling heart — rests at the top of the arc when motion is reduced */}
            <text
              fontSize="20"
              fill="#F4D77E"
              textAnchor="middle"
              dominantBaseline="middle"
              x={reduced ? 400 : undefined}
              y={reduced ? 172 : undefined}
            >
              ❤
              {!reduced && (
                <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href="#loveArc" />
                </animateMotion>
              )}
            </text>
          </svg>

          {/* rotating line */}
          <div className="flex h-10 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6 }}
                className="text-center font-display text-lg italic text-gilded"
              >
                {distanceLines[lineIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
