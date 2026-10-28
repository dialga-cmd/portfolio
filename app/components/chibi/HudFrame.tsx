"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HudFrame() {
  const reduce = useReducedMotion();
  const [xp, setXp] = useState(() => (reduce ? 100 : 0));

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setXp(100), 520);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <motion.div
      className="pointer-events-none relative mx-auto w-full max-w-3xl px-4"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="relative rounded-lg border border-emerald-400/40 bg-black/40 px-4 py-3 backdrop-blur-sm">
        <span className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-emerald-400" />
        <span className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-emerald-400" />
        <span className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
        <span className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-200/90">
            YOUR NAME // Full-stack Developer
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
            <span>LVL 01</span>
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-emerald-400/15">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300"
                initial={{ width: "0%" }}
                animate={{ width: `${xp}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <span>XP {xp}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
