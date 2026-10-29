"use client";

import { motion, useReducedMotion } from "framer-motion";

const BADGES = ["React", "Next.js", "Python", "TypeScript", "C++", "Three.js"];

export default function SkillBadges({ orbit = false }: { orbit?: boolean }) {
  const reduce = useReducedMotion();

  if (orbit) {
    return (
      <div className="relative h-40 w-40 sm:h-48 sm:w-48">
        {BADGES.map((badge, i) => {
          const angle = (i / BADGES.length) * Math.PI * 2;
          const x = Math.cos(angle) * (orbit && !reduce ? 72 : 0);
          const y = Math.sin(angle) * (orbit && !reduce ? 72 : 0);
          return (
            <motion.div
              key={badge}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={reduce ? {} : { x: [x * 0.9, x, x * 0.9], y: [y * 0.9, y, y * 0.9] }}
              transition={{ duration: 6 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="rounded-full border border-emerald-400/40 bg-black/60 px-2.5 py-1 text-[11px] text-emerald-100 backdrop-blur-sm transition hover:bg-emerald-400/10">
                {badge}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-6 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3 px-4 sm:mt-0 sm:absolute sm:left-1/2 sm:top-1/2 sm:w-auto sm:-translate-x-[240%] sm:-translate-y-1/2 sm:flex-col">
      {BADGES.slice(0, 3).map((badge, i) => (
        <motion.div
          key={badge}
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
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-300 to-teal-400" />
            {badge}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
