"use client";

import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useTransform
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type BubbleConfig = {
  left: number;
  size: number;
  delay: number;
  duration: number;
};

const bubbles: BubbleConfig[] = [
  { left: 6, size: 18, delay: 0.1, duration: 13 },
  { left: 12, size: 12, delay: 1.2, duration: 10 },
  { left: 18, size: 20, delay: 0.4, duration: 15 },
  { left: 25, size: 14, delay: 1.7, duration: 12 },
  { left: 33, size: 22, delay: 0.6, duration: 16 },
  { left: 41, size: 16, delay: 2.2, duration: 13 },
  { left: 49, size: 13, delay: 0.9, duration: 11 },
  { left: 57, size: 24, delay: 1.6, duration: 17 },
  { left: 65, size: 15, delay: 0.3, duration: 12 },
  { left: 73, size: 19, delay: 1.1, duration: 15 },
  { left: 81, size: 14, delay: 0.8, duration: 11 },
  { left: 89, size: 21, delay: 1.9, duration: 16 },
  { left: 95, size: 12, delay: 0.5, duration: 10 }
];

function BubbleParticle({
  bubble,
  mouseXPct
}: {
  bubble: BubbleConfig;
  mouseXPct: MotionValue<number>;
}) {
  const repelX = useTransform(mouseXPct, (value) => {
    const delta = value - bubble.left;
    const influence = Math.max(0, 1 - Math.abs(delta) / 11);
    return (delta < 0 ? 1 : -1) * influence * 13;
  });

  return (
    <motion.span
      className="bubble-particle"
      style={{
        left: `${bubble.left}%`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        x: repelX
      }}
      initial={{ y: 0, opacity: 0.42 }}
      animate={{ y: "-118vh", opacity: 0.42 }}
      transition={{
        duration: bubble.duration,
        delay: bubble.delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 0.18,
        ease: "linear"
      }}
    />
  );
}

export function LiveAtmosphere() {
  const pathname = usePathname();
  const mouseXPct = useMotionValue(50);
  const mouseYPct = useMotionValue(50);

  const spotlight = useMotionTemplate`radial-gradient(540px circle at ${mouseXPct}% ${mouseYPct}%, rgba(48,163,255,0.2), transparent 64%)`;
  const warmwash = useMotionTemplate`radial-gradient(600px circle at ${mouseXPct}% ${mouseYPct}%, rgba(255,146,31,0.13), transparent 72%)`;

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    function onMove(event: MouseEvent) {
      const xPct = (event.clientX / window.innerWidth) * 100;
      const yPct = (event.clientY / window.innerHeight) * 100;
      mouseXPct.set(xPct);
      mouseYPct.set(yPct);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseXPct, mouseYPct, pathname]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      <motion.div className="absolute inset-0" style={{ background: warmwash }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,71,71,0.15),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(48,163,255,0.12),transparent_30%)]" />

      {bubbles.map((bubble) => (
        <BubbleParticle key={`${bubble.left}-${bubble.size}`} bubble={bubble} mouseXPct={mouseXPct} />
      ))}
    </div>
  );
}
