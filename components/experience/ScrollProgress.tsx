"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A slim gold reading-progress bar pinned to the top of the page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left"
      aria-hidden
    >
      <div className="h-full w-full bg-gradient-to-r from-rose via-gold to-gold-bright shadow-glow-soft" />
    </motion.div>
  );
}
