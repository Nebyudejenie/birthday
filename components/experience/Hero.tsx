"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { site } from "@/content/site";
import GoldButton from "@/components/ui/GoldButton";
import { scrollToId } from "@/lib/scroll";

const line = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.5 + i * 0.55, duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  // subtle mouse parallax on the name
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });

  const onMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="hero"
      onMouseMove={onMouse}
      className="relative z-[2] flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        variants={line}
        custom={0}
        initial="hidden"
        animate="show"
        className="eyebrow"
      >
        {site.birthday}
      </motion.p>

      <motion.p
        variants={line}
        custom={1}
        initial="hidden"
        animate="show"
        className="mt-6 font-script text-4xl text-rose sm:text-5xl"
      >
        Happy Birthday
      </motion.p>

      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="my-2"
      >
        <motion.h1
          variants={line}
          custom={2}
          initial="hidden"
          animate="show"
          className="font-display text-[19vw] font-bold leading-none text-gilded text-gilded-anim drop-glow sm:text-[13vw] md:text-[11rem]"
        >
          {site.recipient}
        </motion.h1>
      </motion.div>

      <motion.p
        variants={line}
        custom={3}
        initial="hidden"
        animate="show"
        className="font-display text-2xl italic text-cream/90 sm:text-3xl"
      >
        {site.queenLine}
      </motion.p>

      <motion.p
        variants={line}
        custom={4}
        initial="hidden"
        animate="show"
        className="mt-5 max-w-md font-body text-sm font-light leading-relaxed text-cream/55"
      >
        {site.subtitle}
      </motion.p>

      <motion.div
        variants={line}
        custom={5}
        initial="hidden"
        animate="show"
        className="mt-12"
      >
        <GoldButton onClick={() => scrollToId("letter")}>Open Your Gift ✦</GoldButton>
        <p className="mt-6 font-body text-xs tracking-[0.3em] text-cream/35">
          MADE WITH LOVE BY {site.sender.toUpperCase()}
        </p>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0], y: [0, 8, 0] }}
        transition={{ delay: 4, duration: 2.4, repeat: Infinity }}
        aria-hidden
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-gold/40 p-1.5">
          <div className="h-2 w-1 rounded-full bg-gold/70" />
        </div>
      </motion.div>
    </section>
  );
}
