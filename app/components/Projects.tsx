"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { PROJECTS } from "@/data/projects";

const LANG_COLORS: Record<string, string> = {
  Python: "bg-yellow-400",
  "C++": "bg-blue-400",
  TypeScript: "bg-cyan-400",
  JavaScript: "bg-amber-400",
  HTML: "bg-orange-400",
};

export default function Projects() {
  const [filter, setFilter] = useState<"all" | "hackathon" | "web">("all");
  const [lang, setLang] = useState<string>("any");
  const [showAll, setShowAll] = useState(false);

  const featured = useMemo(() => PROJECTS.filter((p) => p.featured), []);
  const others = useMemo(() => {
    let list = PROJECTS.filter((p) => !p.featured);
    if (filter !== "all") list = list.filter((p) => p.category === filter);
    if (lang !== "any") list = list.filter((p) => p.language === lang);
    return list;
  }, [filter, lang]);

  const langs = useMemo(() => Array.from(new Set(PROJECTS.map((p) => p.language))), []);
  const visible = showAll ? others : others.slice(0, 9);

  return (
    <section id="projects" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 04" title="PROJECTS" />
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <motion.div
              key={project.id}
              className="flex h-full flex-col rounded-lg border border-emerald-400/30 bg-black/40 p-5 transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.16)] md:[&:last-child]:col-span-2 lg:[&:last-child]:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium text-emerald-100">{project.name}</p>
                  {project.tag && <span className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300">{project.tag}</span>}
                </div>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">GitHub</a>
              </div>
              <p className="mt-2 text-sm text-emerald-100/75 line-clamp-3">{project.description}</p>
              {project.bullets && (
                <ul className="mt-2 flex flex-col gap-1 text-sm text-emerald-100/75">
                  {project.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              )}
              {project.specialBadges && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.specialBadges.map((b) => (
                    <span key={b} className="rounded-full border border-emerald-400/30 px-2.5 py-1 text-xs text-emerald-100/80">{b}</span>
                  ))}
                </div>
              )}
              {project.specialMuted && <p className="mt-2 text-xs text-emerald-100/50">{project.specialMuted}</p>}
              {project.stack && (
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  {project.stack.map((s) => (
                    <span key={s} className="rounded-full border border-emerald-400/30 px-2.5 py-1 text-xs text-emerald-100/80">{s}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setFilter("all")} className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${filter === "all" ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-100" : "border-emerald-400/30 text-emerald-100/70"}`}>All</button>
            <button onClick={() => setFilter("hackathon")} className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${filter === "hackathon" ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-100" : "border-emerald-400/30 text-emerald-100/70"}`}>Hackathon & AI</button>
            <button onClick={() => setFilter("web")} className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${filter === "web" ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-100" : "border-emerald-400/30 text-emerald-100/70"}`}>Web & Tools</button>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1 text-xs text-emerald-100"
          >
            <option value="any">Any</option>
            {langs.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <motion.div
              layout
              key={project.id}
              className="flex h-full flex-col rounded-lg border border-emerald-400/30 bg-black/40 p-4 transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.16)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${LANG_COLORS[project.language] || "bg-emerald-400"}`} />
                  <p className="text-sm font-medium text-emerald-100">{project.name}</p>
                  {project.stars && project.stars > 0 && <span className="text-xs text-emerald-100/50">★ {project.stars}</span>}
                </div>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">GitHub</a>
              </div>
              {project.tag && <span className="mt-1 self-start rounded-full border border-emerald-400/40 px-2 py-0.5 text-[10px] font-mono text-emerald-300">{project.tag}</span>}
              <p className="mt-2 text-xs leading-relaxed text-emerald-100/75 line-clamp-3">{project.description}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-6 flex flex-col items-center gap-3">
          {others.length > 9 && !showAll && (
            <button onClick={() => setShowAll(true)} className="rounded-full border border-emerald-400/70 px-6 py-2 text-sm text-emerald-100 transition hover:bg-emerald-400/10">Show all</button>
          )}
          <a href="https://github.com/dialga-cmd?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">View all repositories on GitHub</a>
        </div>
        <div className="mt-10 rounded-lg border border-emerald-400/30 bg-black/40 p-4 text-center">
          <a href="#opensource" className="text-sm text-emerald-100/80">Open source suite: GUN101, gun101-gkp, gun101-tpm — see Open Source section</a>
        </div>
      </div>
    </section>
  );
}
