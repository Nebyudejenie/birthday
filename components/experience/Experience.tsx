"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import Atmosphere from "@/components/ambient/Atmosphere";
import Loader from "./Loader";
import Gate from "./Gate";
import ScrollProgress from "./ScrollProgress";
import MusicPlayer from "./MusicPlayer";

import Hero from "./Hero";
import LoveLetter from "@/components/chapters/LoveLetter";
import DistanceGlobe from "@/components/chapters/DistanceGlobe";
import Timeline from "@/components/chapters/Timeline";
import ReasonsSky from "@/components/chapters/ReasonsSky";
import Prayer from "@/components/chapters/Prayer";
import Cake from "@/components/chapters/Cake";
import GiftBoxes from "@/components/chapters/GiftBoxes";
import Finale from "@/components/chapters/Finale";

/** Top-level client orchestrator: loader → (gate) → the cinematic scroll. */
export default function Experience() {
  const [loaded, setLoaded] = useState(false);
  const [unlocked, setUnlocked] = useState(!site.passcode);
  const [armed, setArmed] = useState(false);

  // Arm audio on the first genuine interaction (browsers require this).
  useEffect(() => {
    if (!unlocked) return;
    const arm = () => setArmed(true);
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, [unlocked]);

  return (
    <>
      <Loader onDone={() => setLoaded(true)} />
      {loaded && site.passcode ? <Gate onUnlock={() => setUnlocked(true)} /> : null}

      <ScrollProgress />
      <Atmosphere />
      <MusicPlayer armed={armed} />

      <main className="relative z-[2]">
        <Hero />
        <LoveLetter />
        <DistanceGlobe />
        <Timeline />
        <ReasonsSky />
        <Prayer />
        <Cake />
        <GiftBoxes />
        <Finale />
      </main>
    </>
  );
}
