"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { site } from "@/content/site";
import Atmosphere from "@/components/ambient/Atmosphere";
import AudioProvider from "@/components/audio/AudioProvider";
import MusicDock from "@/components/audio/MusicDock";
import Intro from "./Intro";
import Gate from "./Gate";
import ScrollProgress from "./ScrollProgress";

import Hero from "./Hero";
import HerPortrait from "@/components/chapters/HerPortrait";
import LoveLetter from "@/components/chapters/LoveLetter";
import DistanceGlobe from "@/components/chapters/DistanceGlobe";
import Timeline from "@/components/chapters/Timeline";
import ReasonsSky from "@/components/chapters/ReasonsSky";
import Prayer from "@/components/chapters/Prayer";
import Cake from "@/components/chapters/Cake";
import GiftBoxes from "@/components/chapters/GiftBoxes";
import Finale from "@/components/chapters/Finale";

/**
 * Orchestration:  (passcode gate) → Begin Experience / cinematic intro →
 * the scrolling story. The whole tree lives inside <AudioProvider> so the
 * single soundtrack persists across every section.
 */
export default function Experience() {
  const [unlocked, setUnlocked] = useState(!site.passcode);
  const [revealed, setRevealed] = useState(false);

  return (
    <AudioProvider>
      {/* reducedMotion="user": Framer animations are JS-driven, so the CSS
          prefers-reduced-motion kill-switch never reaches them. This disables
          transform/layout motion for those users while keeping gentle fades. */}
      <MotionConfig reducedMotion="user">
        {site.passcode && !unlocked ? <Gate onUnlock={() => setUnlocked(true)} /> : null}
        {unlocked && !revealed ? <Intro onReveal={() => setRevealed(true)} /> : null}

        <ScrollProgress />
        <Atmosphere />
        <MusicDock />

        {/* main's bottom padding clears the fixed music dock, so the closing line
            is never trapped underneath it at the end of the page */}
        {revealed && (
          <main className="relative z-[2] pb-32 sm:pb-28">
            <Hero />
            <HerPortrait />
            <LoveLetter />
            <DistanceGlobe />
            <Timeline />
            <ReasonsSky />
            <Prayer />
            <Cake />
            <GiftBoxes />
            <Finale />
          </main>
        )}
      </MotionConfig>
    </AudioProvider>
  );
}
