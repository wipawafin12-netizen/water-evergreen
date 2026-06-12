"use client";

import { useMemo } from "react";

// Deterministic pseudo-random — identical on server and client
function rand(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/* ───────── Aurora — flowing light ribbons + drifting mist (Chapter I) ───────── */
export function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Ribbon 1 — cyan */}
      <div
        className="absolute left-[5%] right-[15%] top-[12%] h-40 blur-3xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,211,238,0.35) 30%, rgba(165,243,252,0.45) 55%, rgba(34,211,238,0.25) 75%, transparent)",
          animation: "aurora-wave 11s ease-in-out infinite",
        }}
      />
      {/* Ribbon 2 — teal/green hint, slower, offset */}
      <div
        className="absolute left-[20%] right-[5%] top-[22%] h-28 blur-3xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(94,234,212,0.28) 35%, rgba(103,232,249,0.35) 60%, transparent)",
          animation: "aurora-wave 16s ease-in-out 2s infinite",
        }}
      />
      {/* Ribbon 3 — faint violet edge for depth */}
      <div
        className="absolute left-[10%] right-[25%] top-[8%] h-20 blur-3xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(165,180,252,0.18) 40%, rgba(165,243,252,0.22) 65%, transparent)",
          animation: "aurora-wave 14s ease-in-out 4s infinite",
        }}
      />
      {/* Drifting mist bands near the bottom */}
      <div
        className="absolute left-[-15%] right-[-15%] bottom-[18%] h-32 blur-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(236,254,255,0.10) 30%, rgba(165,243,252,0.14) 55%, transparent)",
          animation: "mist-drift 18s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute left-[-15%] right-[-15%] bottom-[8%] h-24 blur-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(203,213,225,0.08) 40%, rgba(236,254,255,0.12) 70%, transparent)",
          animation: "mist-drift 24s ease-in-out 3s infinite alternate-reverse",
        }}
      />
    </div>
  );
}

/* ───────── Snowfall — falling flakes with sway (Chapter II) ───────── */
export function Snowfall({ count = 40 }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const depth = rand(i + 11); // 0 = far, 1 = near
        return {
          left: (rand(i + 1) * 100).toFixed(2),
          size: (1.5 + depth * 3.5).toFixed(2),
          duration: (14 - depth * 8).toFixed(2), // near flakes fall faster (6-14s)
          delay: (rand(i + 21) * -14).toFixed(2), // negative → already mid-fall on mount
          sway: ((rand(i + 31) - 0.5) * 120).toFixed(1),
          opacity: (0.35 + depth * 0.55).toFixed(3),
          blur: depth < 0.35 ? 1.5 : 0,
          glow: depth > 0.57,
        };
      }),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full bg-[#ecfeff]"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            filter: f.blur ? `blur(${f.blur}px)` : undefined,
            boxShadow: f.glow ? "0 0 6px 1px rgba(236,254,255,0.35)" : undefined,
            "--snow-sway": `${f.sway}px`,
            "--snow-opacity": f.opacity,
            animation: `snow-fall ${f.duration}s linear ${f.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
