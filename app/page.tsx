"use client";

import { motion } from "framer-motion";
import { Chibi, DialogueBox, HudFrame, SkillBadges } from "./components/chibi";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#050d0a] text-neutral-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 80%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/8 blur-[90px]"
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="text-sm font-semibold tracking-tight text-emerald-100">YOUR NAME</div>
        <nav className="flex items-center gap-4 text-sm text-emerald-100/80">
          <a className="transition hover:text-emerald-200" href="#work">Work</a>
          <a className="transition hover:text-emerald-200" href="#about">About</a>
          <a className="transition hover:text-emerald-200" href="#contact">Contact</a>
          <motion.button
            className="rounded-full border border-emerald-400/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-emerald-100 transition hover:bg-emerald-400/10"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Let&apos;s talk
          </motion.button>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl flex-col items-center justify-start px-4 pt-8 sm:pt-12">
        <HudFrame />
        <div className="relative mt-10 flex w-full items-center justify-center">
          <SkillBadges />
          <Chibi />
        </div>
        <DialogueBox />
      </section>
    </main>
  );
}
