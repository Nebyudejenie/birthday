"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

/**
 * Cinematic loading gate. Holds for a graceful minimum, waits for fonts,
 * then dissolves to reveal the night sky.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const minTime = new Promise((r) => setTimeout(r, 2400));
    const fonts =
      typeof document !== "undefined" && "fonts" in document
        ? (document as Document & { fonts: FontFaceSet }).fonts.ready
        : Promise.resolve();

    let cancelled = false;
    Promise.all([minTime, fonts]).then(() => {
      if (!cancelled) setGone(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.1, ease: "easeInOut" } }}
        >
          <div className="relative flex flex-col items-center">
            {/* blooming gold ring */}
            <motion.div
              className="absolute h-40 w-40 rounded-full border border-gold/40"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.1, 1], opacity: [0, 0.8, 0.35] }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-40 w-40 rounded-full"
              style={{ boxShadow: "0 0 80px 8px rgba(212,175,55,0.35)" }}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />

            <motion.p
              className="font-script text-5xl text-gilded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              {site.recipient}
            </motion.p>
            <motion.p
              className="mt-3 font-body text-[0.65rem] uppercase tracking-[0.5em] text-cream/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              a gift is loading
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
