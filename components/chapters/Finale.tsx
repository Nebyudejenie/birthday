"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { finale, site } from "@/content/site";
import GoldButton from "@/components/ui/GoldButton";
import { fireworks, heartBurst } from "@/lib/celebrate";

function useCountdown(targetISO: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number; done: boolean } | null>(null);
  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setLeft({ d: 0, h: 0, m: 0, s: 0, done: true });
        return;
      }
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
        done: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);
  return left;
}

export default function Finale() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const fired = useRef(false);
  const countdown = useCountdown(site.birthdayISO);

  useEffect(() => {
    if (inView && !fired.current) {
      fired.current = true;
      fireworks(4500);
      setTimeout(() => heartBurst({ x: 0.5, y: 0.55 }), 700);
    }
  }, [inView]);

  const replay = () => {
    fireworks(3500);
    heartBurst({ x: 0.5, y: 0.6 });
  };

  return (
    <section id="finale" ref={ref} className="chapter min-h-[100svh] flex flex-col items-center justify-center text-center">
      {/* countdown */}
      {countdown && !countdown.done && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="eyebrow mb-4">counting down to your day</p>
          <div className="flex items-center justify-center gap-4 sm:gap-7">
            {([["Days", countdown.d], ["Hrs", countdown.h], ["Min", countdown.m], ["Sec", countdown.s]] as const).map(
              ([label, val]) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="font-display text-4xl tabular-nums text-gilded sm:text-6xl">
                    {String(val).padStart(2, "0")}
                  </span>
                  <span className="mt-1 font-body text-[0.6rem] uppercase tracking-[0.3em] text-cream/40">
                    {label}
                  </span>
                </div>
              ),
            )}
          </div>
        </motion.div>
      )}
      {countdown?.done && (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12 font-script text-4xl text-gilded sm:text-5xl"
        >
          The day is finally here ✨
        </motion.p>
      )}

      <div className="hairline mb-12 w-48" />

      <div className="max-w-2xl space-y-3">
        {finale.lines.map((l, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.5, duration: 1 }}
            className="font-display text-xl leading-relaxed text-cream/85 sm:text-2xl"
          >
            {l}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + finale.lines.length * 0.5, duration: 1.2 }}
        className="mt-12 font-script text-5xl text-gilded text-gilded-anim drop-glow sm:text-7xl"
      >
        {finale.signOff}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 + finale.lines.length * 0.5, duration: 1 }}
        className="mt-8 font-display text-lg italic text-rose"
      >
        {finale.signature}
      </motion.p>

      <div className="mt-14">
        <GoldButton onClick={replay}>Light The Sky Again ✦</GoldButton>
      </div>

      <p className="mt-20 font-body text-[0.65rem] uppercase tracking-[0.4em] text-cream/25">
        {site.birthday} · for {site.recipient}, with love
      </p>
    </section>
  );
}
