"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { ACHIEVEMENTS } from "@/data/achievements";

export default function Achievements() {
  return (
    <section id="achievements" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 05" title="ACHIEVEMENTS" />
        <div className="relative flex flex-col gap-4">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-emerald-400/40 to-transparent sm:block" />
          {ACHIEVEMENTS.map((ach, idx) => (
            <motion.div
              key={ach.title}
              className="relative rounded-lg border border-emerald-400/30 bg-black/40 p-5 sm:ml-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <div className="absolute -left-6 top-6 hidden h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] sm:block" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                  ACHIEVEMENT UNLOCKED
                </span>
                <p className="text-base font-medium text-emerald-100">{ach.title}</p>
              </div>
              <p className="mt-2 text-sm text-emerald-100/75">{ach.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
