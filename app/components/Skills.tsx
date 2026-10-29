"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { SKILLS } from "@/data/skills";

const groups = [
  { key: "languages", label: "Languages" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "databases", label: "Databases" },
  { key: "aiMl", label: "AI / ML" },
  { key: "securityCrypto", label: "Security & Crypto" },
  { key: "systemsDevops", label: "Systems / DevOps" },
  { key: "openSource", label: "Open Source" },
] as const;

export default function Skills() {
  return (
    <section id="skills" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 02" title="SKILLS" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, idx) => (
            <motion.div
              key={group.key}
              className="rounded-lg border border-emerald-400/30 bg-black/40 p-4 backdrop-blur-sm transition hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.12)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <p className="mb-3 text-sm font-medium text-emerald-100">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {(SKILLS[group.key] as string[]).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-emerald-400/30 px-2.5 py-1 text-xs text-emerald-100/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
