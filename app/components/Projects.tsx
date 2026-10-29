"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { PROJECTS } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 04" title="PROJECTS" />
        <div className="grid gap-4 lg:grid-cols-2">
          {PROJECTS.map((project, idx) => {
            if (project.isSuite) {
              return (
                <motion.div
                  key={project.title}
                  className="rounded-lg border border-emerald-400/30 bg-black/40 p-5 transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.16)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-emerald-100">{project.title}</p>
                    <Link href="#opensource" className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">
                      see suite above
                    </Link>
                  </div>
                  <p className="mt-2 text-sm text-emerald-100/70">{project.summary}</p>
                  <ul className="mt-3 flex flex-col gap-1 text-sm text-emerald-100/75">
                    {project.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span key={s} className="rounded-full border border-emerald-400/30 px-2.5 py-1 text-xs text-emerald-100/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            }
            return (
              <motion.div
                key={project.title}
                className={`rounded-lg border border-emerald-400/30 bg-black/40 p-5 transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.16)] ${
                  project.featured ? "lg:col-span-2" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-emerald-100">{project.title}</p>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">
                      GitHub
                    </a>
                  )}
                </div>
                <p className="mt-2 text-sm text-emerald-100/75">{project.summary}</p>
                <ul className="mt-3 flex flex-col gap-1 text-sm text-emerald-100/75">
                  {project.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span key={s} className="rounded-full border border-emerald-400/30 px-2.5 py-1 text-xs text-emerald-100/80">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
