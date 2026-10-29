"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  number: string;
  title: string;
}

export default function SectionHeading({ number, title }: SectionHeadingProps) {
  return (
    <motion.div
      className="mb-10 flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <span className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400/80">
        {number}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-emerald-400/40 to-transparent" />
      <h2 className="text-2xl font-semibold tracking-tight text-emerald-100 sm:text-3xl lg:text-4xl">
        {title}
      </h2>
    </motion.div>
  );
}
