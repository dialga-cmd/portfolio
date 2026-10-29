"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Chibi } from "./chibi";
import SkillBadges from "./SkillBadges";

const STATS = [
  "4 PyPI packages",
  "3 crypto repos",
  "Top 310 / 46,000+ hackathon",
  "IIT Madras B.S. '29",
];

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-sm uppercase tracking-[0.4em] text-emerald-400/80">
            // HELLO, WORLD
          </span>
          <h1 className="font-[var(--font-display)] text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-tight text-emerald-100">
            ADITYA RAJ
          </h1>
          <p className="text-lg text-emerald-100/80 sm:text-xl">
            Full-Stack Engineer &amp; Open Source Maintainer
          </p>
          <p className="max-w-xl text-base leading-relaxed text-emerald-100/70" style={{ maxWidth: "65ch" }}>
            Self-taught engineer building across cryptography, developer tooling, AI systems,
            computer vision, and production web. Focused on secure protocols and pragmatic
            developer experiences.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#projects"
              className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-300"
            >
              View Projects
            </Link>
            <Link
              href="#contact"
              className="rounded-full border border-emerald-400/70 px-6 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/10"
            >
              Get in touch
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATS.map((stat) => (
              <div
                key={stat}
                className="rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1 text-xs text-emerald-100/80 backdrop-blur-sm"
              >
                {stat}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-[28px] border border-emerald-400/40">
              <span className="absolute -left-1 -top-1 h-5 w-5 border-l-2 border-t-2 border-emerald-400" />
              <span className="absolute -right-1 -top-1 h-5 w-5 border-r-2 border-t-2 border-emerald-400" />
              <span className="absolute -bottom-1 -left-1 h-5 w-5 border-b-2 border-l-2 border-emerald-400" />
              <span className="absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 border-emerald-400" />
            </div>
            <div className="relative flex h-[55vh] max-h-[560px] min-h-[320px] items-end justify-center sm:h-[60vh]">
              <Chibi />
            </div>
            <div className="mt-2 flex justify-center">
              <div className="w-full max-w-xs rounded-lg border border-emerald-400/40 bg-black/60 px-3 py-2 text-center text-xs text-emerald-100/80">
                tap/click the character
              </div>
            </div>
          </div>
          <SkillBadges orbit />
        </motion.div>
      </div>
    </section>
  );
}
