import { soundtrack } from "@/content/site";

/**
 * A tiny mutable signal object the audio engine writes to every frame, and
 * that the ambient canvases read directly in their own rAF loops — so the
 * music can subtly drive the visuals without triggering React re-renders.
 */
export const audioSignals = {
  intensity: 0, // smoothed 0..1 loudness
  time: 0, // current playback seconds
  duration: 0,
  playing: false,
};

export function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Which cinematic chapter the song is currently in. */
export function chapterAt(t: number) {
  const chs = soundtrack.chapters;
  let cur = chs[0];
  for (const c of chs) {
    if (t >= c.at) cur = c;
    else break;
  }
  return cur;
}
