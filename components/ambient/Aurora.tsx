"use client";

/**
 * Slow-moving aurora + a glowing moon, painted with CSS radial gradients.
 * Purely decorative background; sits behind the stars.
 */
export default function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* deep vignette base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#101018_0%,#050505_60%)]" />

      {/* aurora ribbons */}
      <div
        className="absolute -top-1/3 left-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 rounded-full opacity-40 blur-[90px] animate-breathe"
        style={{
          background:
            "conic-gradient(from 90deg, rgba(124,58,237,0.35), rgba(212,175,55,0.25), rgba(183,110,121,0.3), rgba(124,58,237,0.35))",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] h-[55vmax] w-[55vmax] rounded-full opacity-30 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(183,110,121,0.5), transparent 70%)" }}
      />
      <div
        className="absolute right-[-10%] top-[10%] h-[45vmax] w-[45vmax] rounded-full opacity-25 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.45), transparent 70%)" }}
      />

      {/* the moon — one over both cities */}
      <div className="absolute right-[8%] top-[8%] h-24 w-24 rounded-full animate-breathe">
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, #fff8f0, #e8d9b0 55%, #b9a25f 100%)",
            boxShadow:
              "0 0 60px 12px rgba(244,215,126,0.35), inset -10px -10px 24px rgba(120,100,50,0.4)",
          }}
        />
      </div>

      {/* faint film grain via gradient noise substitute */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_3px)]" />
    </div>
  );
}
