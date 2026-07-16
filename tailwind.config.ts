import type { Config } from "tailwindcss";

/**
 * Design tokens for "Love Knows No Distance".
 * Luxury night palette: deep black, warm gold, rose gold, soft cream.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#050505",
          soft: "#0b0b0d",
          raised: "#131316",
        },
        gold: {
          DEFAULT: "#D4AF37",
          bright: "#F4D77E",
          deep: "#A8842A",
        },
        rose: {
          DEFAULT: "#B76E79",
          soft: "#FFD6E7",
        },
        cream: "#FFF8F0",
        burgundy: "#6D071A",
        aurora: "#7C3AED",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        script: ["var(--font-greatvibes)", "cursive"],
        body: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(212,175,55,0.45)",
        "glow-soft": "0 0 40px -18px rgba(212,175,55,0.35)",
        rose: "0 0 60px -15px rgba(183,110,121,0.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 3.5s linear infinite",
        breathe: "breathe 6s ease-in-out infinite",
        "spin-slow": "spin-slow 60s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
