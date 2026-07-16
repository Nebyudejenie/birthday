"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The signature call-to-action: a glass pill with a gold gradient border,
 * a shimmering sweep and a magnetic press. Used for every primary action.
 */
export default function GoldButton({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 font-body text-sm font-medium uppercase tracking-[0.22em] text-cream ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(212,175,55,0.16), rgba(19,19,22,0.6))",
        border: "1px solid rgba(212,175,55,0.55)",
        boxShadow: "0 0 40px -12px rgba(212,175,55,0.5)",
      }}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      {/* shimmer sweep */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,248,240,0.35),transparent)] transition-transform duration-700 group-hover:translate-x-full"
      />
    </motion.button>
  );
}
