import confetti from "canvas-confetti";

const GOLD = ["#D4AF37", "#F4D77E", "#B76E79", "#FFD6E7", "#FFF8F0"];

/** A warm burst of gold & rose confetti from the bottom corners. */
export function celebrate() {
  const end = Date.now() + 900;
  const shots = () => {
    confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: 1 }, colors: GOLD, scalar: 1.1 });
    confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 1 }, colors: GOLD, scalar: 1.1 });
    if (Date.now() < end) requestAnimationFrame(shots);
  };
  shots();
  confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors: GOLD, scalar: 1.2 });
}

/** Heart-shaped confetti — used at the finale. */
export function heartBurst(origin: { x: number; y: number } = { x: 0.5, y: 0.5 }) {
  const heart = confetti.shapeFromText ? confetti.shapeFromText({ text: "❤", scalar: 3 }) : undefined;
  confetti({
    particleCount: 40,
    spread: 120,
    origin,
    colors: ["#B76E79", "#6D071A", "#FFD6E7"],
    shapes: heart ? [heart] : undefined,
    scalar: heart ? 3 : 1.4,
    gravity: 0.7,
    ticks: 220,
  });
}

/** A sustained fireworks finale across the top of the screen. */
export function fireworks(durationMs = 4000) {
  const end = Date.now() + durationMs;
  const frame = () => {
    confetti({
      particleCount: 5,
      startVelocity: 34,
      spread: 360,
      ticks: 90,
      gravity: 0.9,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors: GOLD,
      scalar: 1.1,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
