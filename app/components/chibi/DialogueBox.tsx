"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = ["Hi, I'm ADITYA RAJ", "I build things for the web", "Scroll down to see my work"];

export default function DialogueBox() {
  const reduce = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (reduce) return;
    const line = LINES[lineIndex];
    let i = 0;
    setText("");
    const id = window.setInterval(() => {
      i += 1;
      setText(line.slice(0, i));
      if (i >= line.length) {
        window.clearInterval(id);
        window.setTimeout(() => {
          setLineIndex((prev) => (prev + 1) % LINES.length);
        }, 1400);
      }
    }, 38);
    return () => window.clearInterval(id);
  }, [lineIndex, reduce]);

  return (
    <motion.div
      className="mt-6 w-full max-w-sm rounded-lg border border-emerald-400/40 bg-black/60 px-4 py-3 text-sm text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.18)] backdrop-blur-sm"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-emerald-300">&gt;</span>
        <span>{reduce ? LINES[lineIndex] : text}</span>
        {!reduce && (
          <motion.span
            className="inline-block h-4 w-2 bg-emerald-300"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
      {!reduce && (
        <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-emerald-400/60">
          tap/click the character
        </div>
      )}
    </motion.div>
  );
}
