"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "./useInView";
import { Aurora, Snowfall } from "./SceneEffects";

const VARIANTS = {
  default: {
    bg: "linear-gradient(180deg, #02050a 0%, #051828 50%, #0a2236 100%)",
    glow: null,
  },
  glacier: {
    bg: "linear-gradient(180deg, #051828 0%, #0a2236 50%, #103952 100%)",
    glow: {
      pos: "left-1/2 top-1/3 -translate-x-1/2",
      size: "h-125 w-75",
      color: "rgba(165,243,252,0.18)",
    },
  },
  stone: {
    bg: "linear-gradient(180deg, #050a14 0%, #0e1a2a 50%, #02050a 100%)",
    grain: true,
  },
  spring: {
    bg: "linear-gradient(180deg, #02050a 0%, #0e3548 40%, #1b5a78 100%)",
    glow: {
      pos: "left-1/2 top-1/3 -translate-x-1/2",
      size: "h-125 w-75",
      color: "rgba(34,211,238,0.20)",
    },
  },
  hearth: {
    bg: "linear-gradient(135deg, #0a1424 0%, #1a1410 60%, #2a1d15 100%)",
    glow: {
      pos: "right-[10%] top-[20%]",
      size: "h-100 w-100",
      color: "rgba(201,114,42,0.22)",
    },
  },
  pour: {
    bg: "linear-gradient(180deg, #050a14 0%, #0c1f2e 50%, #02050a 100%)",
    glow: {
      pos: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
      size: "h-100 w-100",
      color: "rgba(165,243,252,0.15)",
    },
  },
  void: {
    bg: "radial-gradient(ellipse at center, #050a14 0%, #02050a 70%)",
    glow: null,
  },
};

export default function StoryScene({
  index,
  chapter,
  eyebrow,
  title,
  body,
  quote,
  align = "left",
  accent = "var(--accent)",
  variant = "default",
  videoSrc = null,
  videoTint = "rgba(2,5,10,0.55)",
  posterSrc = null,
  effect = null,
  decoration = null,
  decorationSide = "left",
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoMountRef, shouldMountVideo] = useInView({ rootMargin: "400px", once: true });
  const videoElRef = useRef(null);
  const hasVideo = videoSrc && !videoFailed && !reduced;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, -60]);
  const numberOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 0.045, 0.045, 0]
  );

  const v = VARIANTS[variant] ?? VARIANTS.default;
  const isCenter = align === "center";
  const isRight = align === "right";

  return (
    <section
      ref={(node) => { ref.current = node; videoMountRef.current = node; }}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      aria-labelledby={`chapter-${index}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: v.bg }} />

      {/* Optional cinematic video backdrop */}
      {hasVideo && (
        <>
          {/* Poster — instant fill until video first frame ready */}
          {posterSrc && (
            <img
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                videoReady ? "opacity-0" : "opacity-100"
              }`}
              src={posterSrc}
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden
            />
          )}
          {shouldMountVideo && (
            <video
              ref={videoElRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              src={videoSrc}
              poster={posterSrc ?? undefined}
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
          {/* Cool tone color grading on top of video */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, ${videoTint} 0%, rgba(5,10,20,0.35) 50%, ${videoTint} 100%)`,
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-40"
            style={{
              background:
                "linear-gradient(180deg, #67e8f9 0%, transparent 50%, #0a2236 100%)",
            }}
            aria-hidden
          />
        </>
      )}

      {/* Glow */}
      {v.glow && (
        <div
          className={`absolute ${v.glow.pos} ${v.glow.size} rounded-full blur-3xl`}
          style={{
            background: `radial-gradient(circle, ${v.glow.color}, transparent 70%)`,
          }}
          aria-hidden
        />
      )}

      {/* Stone grain texture */}
      {v.grain && (
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, #a5f3fc 1px, transparent 1px), radial-gradient(circle at 70% 60%, #ecfeff 1px, transparent 1px)",
            backgroundSize: "80px 80px, 120px 120px",
          }}
          aria-hidden
        />
      )}

      {/* Atmospheric scene effects */}
      {!reduced && effect === "aurora" && <Aurora />}
      {!reduced && effect === "snow" && <Snowfall count={44} />}

      {/* Decoration slot — e.g. 3D bottle, hidden on small screens */}
      {decoration && (
        <div
          className={`absolute inset-y-0 z-6 hidden md:block w-1/2 pointer-events-none ${
            decorationSide === "right" ? "right-0" : "left-0"
          }`}
        >
          {decoration}
        </div>
      )}

      {/* Top + bottom edge vignette for smoother scene transitions */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(180deg, #02050a, transparent)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(0deg, #02050a, transparent)" }}
        aria-hidden
      />

      {/* Content */}
      <motion.div
        style={{ opacity, y }}
        className={`relative z-10 max-w-6xl w-full px-8 md:px-16 ${
          isCenter ? "text-center" : isRight ? "ml-auto text-right" : "text-left"
        }`}
      >
        <div
          className={`max-w-2xl ${
            isCenter ? "mx-auto" : isRight ? "ml-auto" : ""
          } ${
            hasVideo
              ? "glint p-8 md:p-10 rounded-md backdrop-blur-md"
              : ""
          }`}
          style={
            hasVideo
              ? {
                  background:
                    "linear-gradient(135deg, rgba(2,5,10,0.55), rgba(10,34,54,0.35))",
                  border: "1px solid rgba(165,243,252,0.10)",
                }
              : undefined
          }
        >
          {/* Chapter divider */}
          <motion.div
            initial={{ opacity: 0, x: isRight ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={`flex items-center gap-4 mb-8 ${
              isCenter ? "justify-center" : isRight ? "justify-end" : ""
            }`}
          >
            <span
              className="h-px w-12"
              style={{ background: accent }}
              aria-hidden
            />
            <span
              className="text-[0.65rem] tracking-[0.4em] uppercase font-light"
              style={{ color: accent }}
            >
              {chapter}
            </span>
          </motion.div>

          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 0.72, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-[var(--fg-muted)] italic text-sm md:text-base mb-4 tracking-wider"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h2
            id={`chapter-${index}`}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-8 text-[var(--fg-primary)]"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            {title}
          </motion.h2>

          {body && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1.2, delay: 0.35 }}
              className="text-[var(--fg-secondary)] text-lg md:text-xl leading-relaxed max-w-xl font-light"
            >
              {body}
            </motion.p>
          )}

          {quote && (
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1.6, delay: 0.5 }}
              className="mt-12 text-[var(--fg-primary)] text-2xl md:text-3xl italic leading-relaxed border-l pl-6"
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                borderColor: accent,
              }}
            >
              &ldquo;{quote}&rdquo;
            </motion.blockquote>
          )}
        </div>
      </motion.div>

      {/* Faint chapter number — large editorial */}
      <motion.span
        style={{
          opacity: numberOpacity,
          fontFamily: "var(--font-display), Georgia, serif",
        }}
        className="absolute right-8 top-8 text-[12rem] md:text-[20rem] leading-none select-none pointer-events-none text-[var(--fg-primary)]"
        aria-hidden
      >
        {String(index).padStart(2, "0")}
      </motion.span>
    </section>
  );
}
