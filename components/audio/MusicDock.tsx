"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioProvider";
import { chapterAt, formatTime } from "@/lib/audioStore";
import { soundtrack } from "@/content/site";

function Icon({ name }: { name: "play" | "pause" | "sound" | "muted" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "currentColor" } as const;
  if (name === "play") return <svg {...common}><path d="M8 5v14l11-7z" /></svg>;
  if (name === "pause") return <svg {...common}><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>;
  if (name === "muted")
    return (
      <svg {...common}><path d="M4 9v6h4l5 5V4L8 9H4z" /><path d="M16 9l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
    );
  return <svg {...common}><path d="M4 9v6h4l5 5V4L8 9H4z" /><path d="M16 8a5 5 0 010 8M18.5 5.5a9 9 0 010 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>;
}

export default function MusicDock() {
  const { started, playing, muted, volume, currentTime, duration, toggle, toggleMute, setVolume, seek } = useAudio();
  const barRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dur = duration || soundtrack.chapters[soundtrack.chapters.length - 1].at + 300;
  const pct = dur ? Math.min(100, (currentTime / dur) * 100) : 0;
  const chapter = chapterAt(currentTime);

  const seekFromEvent = (clientX: number) => {
    const el = barRef.current;
    if (!el || !dur) return;
    const r = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    seek(ratio * dur);
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => seekFromEvent(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, dur]);

  if (!started) return null;

  return (
    /* Positioning lives on this plain wrapper: Framer writes an inline
       `transform` for the entrance, which would otherwise override Tailwind's
       -translate-x-1/2 and push the dock off the right edge on phones. */
    <div
      className="fixed bottom-4 left-1/2 z-[70] w-[min(360px,92vw)] -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl px-3.5 py-3 shadow-glow-soft"
      >
        <div className="flex items-center gap-3">
          {/* play / pause */}
          <button
            onClick={toggle}
            aria-label={playing ? "Pause music" : "Play music"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink"
            style={{ background: "linear-gradient(180deg,#F4D77E,#D4AF37)", boxShadow: "0 0 24px -6px rgba(212,175,55,0.7)" }}
          >
            <Icon name={playing ? "pause" : "play"} />
          </button>

          {/* chapter + time (tap toggles volume on touch) */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="min-w-0 flex-1 text-left"
            aria-label="Toggle volume controls"
          >
            <p className="truncate font-body text-[0.7rem] font-medium uppercase tracking-[0.18em] text-gold">
              {chapter.label}
            </p>
            <p className="font-body text-[0.68rem] tabular-nums text-cream/45">
              {chapter.mood} · {formatTime(currentTime)} / {formatTime(dur)}
            </p>
          </button>

          {/* mute */}
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cream/70 transition hover:text-gold"
          >
            <Icon name={muted ? "muted" : "sound"} />
          </button>
        </div>

        {/* progress bar */}
        <div
          ref={barRef}
          onPointerDown={(e) => {
            setDragging(true);
            seekFromEvent(e.clientX);
          }}
          /* 24px tall hit area (WCAG 2.2 target size) — the visible rail stays 3px */
          className="group relative mt-1.5 h-6 cursor-pointer"
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(dur)}
          aria-valuenow={Math.round(currentTime)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") seek(Math.min(dur, currentTime + 15));
            if (e.key === "ArrowLeft") seek(Math.max(0, currentTime - 15));
          }}
        >
          <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-cream/15" />
          <div
            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-rose via-gold to-gold-bright"
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-bright opacity-0 shadow-glow transition-opacity group-hover:opacity-100"
            style={{ left: `${pct}%`, opacity: dragging ? 1 : undefined }}
          />
        </div>

        {/* volume (expands on hover / tap) */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center gap-2">
                <span className="text-cream/50"><Icon name="sound" /></span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Volume"
                  className="h-6 w-full cursor-pointer appearance-none rounded-full bg-transparent accent-gold"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
