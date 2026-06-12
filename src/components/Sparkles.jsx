"use client";

import { useMemo } from "react";

// Deterministic pseudo-random so server/client render identically
function rand(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const COLORS = ["#ecfeff", "#a5f3fc", "#67e8f9", "#cbd5e1"];

export default function Sparkles({ count = 28, className = "" }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = (1 + rand(i + 201) * 2.4).toFixed(2);
        const delay = (rand(i + 301) * 6).toFixed(2);
        return {
          left: (rand(i + 1) * 100).toFixed(2),
          top: (rand(i + 101) * 100).toFixed(2),
          size,
          delay,
          duration: (2.5 + rand(i + 401) * 4).toFixed(2),
          driftDuration: (8 + rand(i + 501) * 10).toFixed(2),
          color: COLORS[Math.floor(rand(i + 601) * COLORS.length)],
          glow: rand(i + 701) > 0.6,
          glowSize: (parseFloat(size) * 4).toFixed(2),
        };
      }),
    [count]
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: p.glow
              ? `0 0 ${p.glowSize}px ${p.size}px ${p.color}44`
              : "none",
            animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite, float-drift ${p.driftDuration}s ease-in-out ${p.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
