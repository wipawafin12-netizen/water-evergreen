"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Button } from "@heroui/react";
import MountainBg from "@/components/MountainBg";
import StoryScene from "@/components/StoryScene";
import Sparkles from "@/components/Sparkles";
import { useInView } from "@/components/useInView";

const Bottle3D = dynamic(() => import("@/components/Bottle3D"), {
  ssr: false,
  loading: () => null,
});

function LazyBottle() {
  const [ref, visible] = useInView({ rootMargin: "500px", once: true });
  return (
    <div ref={ref} className="absolute inset-0">
      {visible && <Bottle3D />}
    </div>
  );
}

const ACCENT_ICE = "#a5f3fc";
const ACCENT_CYAN = "#22d3ee";
const ACCENT_PLATINUM = "#e0f7fa";
const ACCENT_AMBER = "#c9722a";

export default function Home() {
  const heroRef = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress: heroProg } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTitleY = useTransform(heroProg, [0, 1], reduced ? [0, 0] : [0, -100]);
  const heroTitleOpacity = useTransform(heroProg, [0, 0.6], [1, 0]);

  return (
    <div className="bg-[var(--bg-deep)] text-[var(--fg-primary)]">
      {/* ─────────────── HERO ─────────────── */}
      <section ref={heroRef} className="relative h-[200vh] w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <MountainBg />

          {/* Floating ice sparkles */}
          {!reduced && <Sparkles count={36} className="z-10" />}

          {/* Hero copy */}
          <motion.div
            style={{ y: heroTitleY, opacity: heroTitleOpacity }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-between py-20 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="divider-luxury"
            >
              <span>Est. Aged 3,000 Years</span>
            </motion.div>

            <div className="text-center px-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-shimmer text-7xl md:text-9xl lg:text-[12rem] font-extralight tracking-[0.15em] leading-none"
                style={{
                  fontFamily: "var(--font-display), Georgia, serif",
                  filter: "drop-shadow(0 0 40px rgba(165,243,252,0.22))",
                }}
              >
                AURÉLIA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.2 }}
                className="mt-6 text-sm md:text-base tracking-[0.3em] uppercase font-light text-[var(--fg-secondary)]"
              >
                Mineral Water · From the Glacial Spring
              </motion.p>
            </div>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 1.8 }}
              className="flex flex-col items-center gap-2 text-[var(--fg-muted)] text-[0.6rem] tracking-[0.4em] uppercase"
            >
              <span>Scroll</span>
              <motion.span
                animate={reduced ? {} : { y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
                className="block h-8 w-px"
                style={{
                  background:
                    "linear-gradient(180deg, var(--accent), transparent)",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Bottom vignette */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(0deg, var(--bg-deep), transparent)",
            }}
          />
        </div>
      </section>

      {/* ─────────────── SCENE 1 ─────────────── */}
      <StoryScene
        index={1}
        chapter="Chapter I · The Silence"
        title={
          <>
            Above
            <br />
            the clouds,
            <br />
            <span className="italic text-[var(--accent)]">silence.</span>
          </>
        }
        body="Where the air thins and the sky turns indigo, a single peak rises beyond the reach of weather, untouched for a thousand winters."
        align="left"
        variant="glacier"
        accent={ACCENT_ICE}
        effect="aurora"
      />

      {/* ─────────────── SCENE 2 ─────────────── */}
      <StoryScene
        index={2}
        chapter="Chapter II · The Origin"
        eyebrow="Three thousand years ago…"
        title={
          <>
            A single
            <br />
            snowflake began
            <br />
            <span className="italic text-[var(--accent)]">a journey.</span>
          </>
        }
        body="It fell on granite older than memory, melted slowly into the seam of a mountain, and began the long descent that no living person would ever see complete."
        align="right"
        variant="stone"
        accent={ACCENT_PLATINUM}
        effect="snow"
        decoration={<LazyBottle />}
        decorationSide="left"
      />

      {/* ─────────────── SCENE 3 ─────────────── */}
      <StoryScene
        index={3}
        chapter="Chapter III · The Passage"
        title={
          <>
            Through
            <br />
            a hundred layers
            <br />
            <span className="italic text-[var(--accent)]">of stone.</span>
          </>
        }
        body="Quartz. Copper. Limestone. Each mineral added by patience alone — the kind of refinement no laboratory has ever reproduced, the kind only time can perform."
        align="left"
        variant="stone"
        accent={ACCENT_CYAN}
        videoSrc="/video/scene-passage.mp4"
        videoTint="rgba(2,5,10,0.65)"
        posterSrc="/poster/scene-passage.webp"
      />

      {/* ─────────────── SCENE 4 ─────────────── */}
      <StoryScene
        index={4}
        chapter="Chapter IV · The Source"
        title={
          <>
            Until the day
            <br />
            it was ready to be
            <br />
            <span className="italic text-[var(--accent)]">more than water.</span>
          </>
        }
        body="From a single seam in the rockface, the spring emerges quietly — no roar, no drama. The kind of arrival that has nothing to prove."
        quote="Some things are not bottled. They are released."
        align="center"
        variant="spring"
        accent={ACCENT_ICE}
        videoSrc="/video/scene-source.mp4"
        videoTint="rgba(2,8,14,0.55)"
        posterSrc="/poster/scene-source.webp"
      />

      {/* ─────────────── SCENE 5 ─────────────── */}
      <StoryScene
        index={5}
        chapter="Chapter V · The Connoisseur"
        title={
          <>
            Some things in life
            <br />
            <span className="italic" style={{ color: ACCENT_AMBER }}>
              should not be rushed.
            </span>
          </>
        }
        body="A glass in hand. A view earned over decades. The world outside continues — but here, for this moment, time obeys a different rhythm."
        align="right"
        variant="hearth"
        accent={ACCENT_AMBER}
        videoSrc="/video/scene-hearth.mp4"
        videoTint="rgba(10,8,4,0.55)"
        posterSrc="/poster/scene-hearth.webp"
      />

      {/* ─────────────── SCENE 6 ─────────────── */}
      <StoryScene
        index={6}
        chapter="Chapter VI · The Pour"
        title={
          <>
            Crystal meets
            <br />
            <span className="italic text-[var(--accent)]">crystal.</span>
          </>
        }
        body="Poured into hand-blown glass, the water releases the breath of three thousand years. Bubbles ascend like memory rising to the surface."
        align="left"
        variant="pour"
        accent={ACCENT_PLATINUM}
        videoSrc="/video/scene-pour.mp4"
        videoTint="rgba(3,8,14,0.60)"
        posterSrc="/poster/scene-pour.webp"
      />

      {/* ─────────────── SCENE 7 ─────────────── */}
      <StoryScene
        index={7}
        chapter="Chapter VII · The Sip"
        title={
          <>
            The moment
            <br />
            needs
            <br />
            <span className="italic text-[var(--accent)]">no words.</span>
          </>
        }
        quote="Satisfaction that asks for no audience."
        align="center"
        variant="void"
        accent={ACCENT_CYAN}
      />

      {/* ─────────────── FINALE ─────────────── */}
      <section className="relative h-[200vh] w-full">
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ background: "var(--bg-deep)" }}
        >
          {/* Spotlight — platinum */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(165,243,252,0.18) 0%, rgba(34,211,238,0.07) 40%, transparent 70%)",
            }}
            aria-hidden
          />

          {/* Finale sparkles — denser, like champagne */}
          {!reduced && <Sparkles count={48} className="z-10" />}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-between py-20 pointer-events-none"
          >
            <div className="divider-luxury" style={{ color: ACCENT_ICE }}>
              <span>Chapter VIII · The Promise</span>
            </div>

            <div className="text-center px-6 mt-auto mb-12">
              <h2
                className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-tight text-[var(--fg-primary)]"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Some things are
                <br />
                <span className="text-shimmer italic">worth the wait.</span>
              </h2>
              <p className="mt-8 text-xs md:text-sm tracking-[0.4em] uppercase text-[var(--fg-muted)]">
                AURÉLIA · Mineral Water · Aged 3,000 Years
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
                <Button
                  size="lg"
                  className="glow-cta glint rounded-none px-10 tracking-[0.3em] text-xs uppercase font-light transition-all"
                  style={{
                    background: ACCENT_ICE,
                    color: "#02050a",
                  }}
                >
                  Acquire a Case
                </Button>
                <Button
                  size="lg"
                  variant="bordered"
                  className="glint rounded-none px-10 tracking-[0.3em] text-xs uppercase font-light text-[var(--fg-primary)]"
                  style={{
                    border: "1px solid var(--border-strong)",
                    background: "var(--surface-glass)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  The Story
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── FOOTER ─────────────── */}
      <footer
        className="relative border-t py-16 px-8 text-center"
        style={{
          background: "var(--bg-deep)",
          borderColor: "var(--border-hair)",
        }}
      >
        <p
          className="text-3xl italic text-[var(--fg-muted)]"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          AURÉLIA
        </p>
        <p className="mt-4 text-[0.6rem] tracking-[0.4em] uppercase text-[var(--fg-faint)]">
          Bottled at the source · Limited release · 750 mL
        </p>
        <p className="mt-12 text-[0.55rem] tracking-[0.3em] uppercase text-[var(--fg-faint)]">
          © 2026 Aurélia Maison des Eaux · All rights reserved
        </p>
      </footer>
    </div>
  );
}
