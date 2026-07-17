"use client";

import { useState } from "react";
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
      {site.passcode && !unlocked ? <Gate onUnlock={() => setUnlocked(true)} /> : null}
      {unlocked && !revealed ? <Intro onReveal={() => setRevealed(true)} /> : null}

      <ScrollProgress />
      <Atmosphere />
      <MusicDock />

      {revealed && (
        <main className="relative z-[2]">
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
    </AudioProvider>
  );
}
