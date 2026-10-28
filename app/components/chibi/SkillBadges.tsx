"use client";

import { motion, useReducedMotion } from "framer-motion";

const BADGES = [
  { label: "React", color: "from-cyan-300 to-sky-400" },
  { label: "Next.js", color: "from-emerald-300 to-teal-400" },
  { label: "Python", color: "from-yellow-300 to-amber-400" },
];

export default function SkillBadges() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto mt-6 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3 px-4 sm:mt-0 sm:absolute sm:left-1/2 sm:top-1/2 sm:w-auto sm:-translate-x-[240%] sm:-translate-y-1/2 sm:flex-col">
      {BADGES.map((badge, i) => (
        <motion.div
          key={badge.label}
          className="group relative"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + i * 0.12, duration: 0.4 }}
        >
          <motion.div
            className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-black/50 px-3 py-1 text-xs text-emerald-100 backdrop-blur-sm"
            animate={reduce ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 3.6 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 24px rgba(16,185,129,0.35)" }}
          >
            <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${badge.color}`} />
            {badge.label}
          </motion.div>
          <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-emerald-200 opacity-0 transition group-hover:opacity-100">
            Proficient
          </div>
        </motion.div>
      ))}
    </div>
  );
}
