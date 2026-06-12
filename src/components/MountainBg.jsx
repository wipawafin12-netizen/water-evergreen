"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

export default function MountainBg() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const showSvgFallback = videoFailed || reduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.05, 1.18]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.85, 0.4]);
  const auroraOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.45, 0.32, 0.12]);
  const yFar = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "18%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "36%"]);
  const yNear = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "62%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {/* Base glacier sky — always rendered behind everything */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #02050a 0%, #051421 28%, #0a2236 55%, #103952 80%, #1b5a78 100%)",
        }}
      />

      {/* Poster image — instant fill until video first frame is ready */}
      {!showSvgFallback && (
        <motion.img
          style={{ scale: videoScale, opacity: videoOpacity }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
          src="/poster/hero-mountains.webp"
          alt=""
          aria-hidden
          fetchPriority="high"
        />
      )}

      {/* ─── Higgsfield cinematic mountain video (Cinema Studio 3.0) ─── */}
      {!showSvgFallback && (
        <motion.video
          style={{ scale: videoScale, opacity: videoOpacity }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          src="/video/hero-mountains.mp4"
          poster="/poster/hero-mountains.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
          aria-hidden
        />
      )}

      {/* Cool-tone color grading overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,5,10,0.45) 0%, rgba(5,20,33,0.20) 40%, rgba(10,34,54,0.55) 100%)",
        }}
        aria-hidden
      />

      {/* Cyan tint for atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-50"
        style={{ background: "linear-gradient(180deg, #67e8f9 0%, #0a2236 100%)" }}
        aria-hidden
      />

      {/* Aurora glow */}
      <motion.div
        style={{ opacity: auroraOpacity }}
        className="absolute left-1/2 top-[18%] -translate-x-1/2 h-130 w-130 rounded-full blur-3xl pointer-events-none"
        aria-hidden
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(165,243,252,0.55) 0%, rgba(34,211,238,0.25) 35%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Ice particle stars */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, #a5f3fc 50%, transparent), radial-gradient(1px 1px at 70% 20%, #ecfeff 50%, transparent), radial-gradient(1.5px 1.5px at 40% 60%, #67e8f9 50%, transparent), radial-gradient(1px 1px at 85% 70%, #cbd5e1 50%, transparent), radial-gradient(1px 1px at 12% 80%, #a5f3fc 50%, transparent)",
          backgroundSize: "400px 400px",
        }}
        aria-hidden
      />

      {/* ─── SVG fallback — shown when video fails or reduced-motion ─── */}
      {showSvgFallback && (
        <>
          <motion.svg
            style={{ y: yFar }}
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-[60%]"
            aria-hidden
          >
            <polygon
              points="0,600 0,380 180,260 320,340 480,220 640,300 820,200 980,290 1180,240 1340,310 1440,280 1440,600"
              fill="#0e3548"
              opacity="0.65"
            />
          </motion.svg>

          <motion.svg
            style={{ y: yMid }}
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-[55%]"
            aria-hidden
          >
            <defs>
              <linearGradient id="mid-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c2a3a" />
                <stop offset="100%" stopColor="#051828" />
              </linearGradient>
            </defs>
            <polygon
              points="0,600 0,420 140,320 280,400 420,280 580,360 740,260 900,340 1080,290 1240,360 1440,320 1440,600"
              fill="url(#mid-grad)"
              opacity="0.92"
            />
            <polygon points="380,330 420,280 460,320" fill="#ecfeff" opacity="0.9" />
            <polygon points="700,310 740,260 780,300" fill="#ecfeff" opacity="0.9" />
            <polygon points="860,380 900,340 940,375" fill="#a5f3fc" opacity="0.7" />
            <polygon points="240,400 280,360 320,395" fill="#cbd5e1" opacity="0.55" />
          </motion.svg>

          <motion.svg
            style={{ y: yNear }}
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-[45%]"
            aria-hidden
          >
            <polygon
              points="0,600 0,500 200,400 380,470 560,380 740,440 920,360 1100,420 1280,380 1440,440 1440,600"
              fill="#020a14"
            />
          </motion.svg>
        </>
      )}

      {/* Bottom fade to next scene */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, #02050a 80%)" }}
        aria-hidden
      />
    </div>
  );
}
