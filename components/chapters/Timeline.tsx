"use client";

import { motion } from "framer-motion";
import { timeline } from "@/content/site";
import SectionTitle from "@/components/ui/SectionTitle";

export default function Timeline() {
  return (
    <section id="story" className="chapter">
      <SectionTitle eyebrow="Chapter III" script="how it happened" title="Our Story" />

      <div className="relative mx-auto max-w-3xl">
        {/* central luminous line */}
        <div
          className="absolute left-4 top-0 h-full w-px sm:left-1/2 sm:-translate-x-1/2"
          style={{ background: "linear-gradient(180deg,transparent,rgba(212,175,55,0.6),transparent)" }}
        />

        <div className="space-y-10">
          {timeline.map((item, i) => {
            const left = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex ${left ? "sm:justify-start" : "sm:justify-end"}`}
              >
                {/* node */}
                <div className="absolute left-4 top-6 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center sm:left-1/2">
                  <span className="h-3 w-3 rounded-full bg-gold shadow-glow" />
                  <span className="absolute h-4 w-4 animate-ping rounded-full bg-gold/40" />
                </div>

                <motion.div
                  whileHover={{ y: -5, rotateZ: left ? -0.6 : 0.6 }}
                  className="glass ml-10 w-full rounded-2xl p-6 sm:ml-0 sm:w-[46%]"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="eyebrow !tracking-[0.3em]">{item.year}</span>
                  </div>
                  <h3 className="font-display text-2xl text-cream">{item.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-cream/60">
                    {item.text}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
