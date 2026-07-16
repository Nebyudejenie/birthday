"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { site } from "@/content/site";

/**
 * Optional passcode gate. Renders only when site.passcode is set.
 * A gentle lock — "a special surprise for Ebony".
 */
export default function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === site.passcode.toLowerCase()) {
      setUnlocked(true);
      setTimeout(onUnlock, 900);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ink px-6"
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <div className="text-center">
            <p className="font-script text-4xl text-gilded">A special surprise</p>
            <p className="mt-2 font-body text-sm tracking-[0.3em] text-cream/50">
              FOR {site.recipient.toUpperCase()}
            </p>
            <form onSubmit={submit} className="mt-10 flex flex-col items-center gap-4">
              <motion.input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="whisper the word"
                animate={error ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                className="glass w-64 rounded-full px-6 py-3 text-center font-body text-cream outline-none placeholder:text-cream/30"
                style={{ borderColor: error ? "rgba(183,110,121,0.8)" : undefined }}
              />
              <button
                type="submit"
                className="font-body text-xs uppercase tracking-[0.35em] text-gold transition hover:text-gold-bright"
              >
                Enter ✦
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
