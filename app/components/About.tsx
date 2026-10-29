"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import SectionPose from "./SectionPose";

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 01" title="ABOUT" />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-base leading-relaxed text-emerald-100/80" style={{ maxWidth: "65ch" }}>
              Self-taught full-stack engineer, IIT Madras B.S. student (Data Science and Applications, expected 2029), and open-source maintainer. I build across cryptography, developer tooling, AI systems, computer vision, and full-stack web, with experience designing security-sensitive protocols, AST-based code analysis, and production-oriented web systems.
            </p>
            <p className="text-base text-emerald-100/70">Based in Ranchi, India.</p>
            <div className="rounded-lg border border-emerald-400/40 bg-black/40 p-4 backdrop-blur-sm">
              <p className="text-sm font-medium text-emerald-100">IIT Madras</p>
              <p className="text-sm text-emerald-100/70">B.S. Data Science and Applications</p>
              <p className="text-xs text-emerald-100/50">Expected 2029</p>
            </div>
          </motion.div>
          <div className="flex justify-center">
            <SectionPose name="about" />
          </div>
        </div>
      </div>
    </section>
  );
}
