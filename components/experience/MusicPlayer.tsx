"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { music } from "@/content/site";

/**
 * Floating audio control. Browsers block autoplay, so playback starts on the
 * first user interaction (or the button). Hidden entirely if no track is set.
 */
export default function MusicPlayer({ armed }: { armed: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!music.src) return;
    const audio = new Audio(music.src);
    audio.loop = true;
    audio.volume = 0.0;
    audioRef.current = audio;
    setReady(true);
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Try to gently start once the gift is opened.
  useEffect(() => {
    if (armed && audioRef.current && !playing) {
      fadeTo(0.45);
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false)); // will wait for a click
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed]);

  const fadeTo = (target: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const step = (target - audio.volume) / 20;
    let n = 0;
    const id = setInterval(() => {
      if (!audioRef.current) return clearInterval(id);
      audio.volume = Math.min(1, Math.max(0, audio.volume + step));
      if (++n >= 20) clearInterval(id);
    }, 40);
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      fadeTo(0.45);
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (!music.src || !ready) return null;

  return (
    <motion.button
      onClick={toggle}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="glass fixed bottom-5 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full text-gold"
      aria-label={playing ? "Pause music" : "Play music"}
      title={music.title}
    >
      {playing ? (
        <span className="flex items-end gap-[3px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-gold"
              animate={{ height: [6, 16, 6] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </span>
      ) : (
        <span aria-hidden className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-gold" />
      )}
    </motion.button>
  );
}
