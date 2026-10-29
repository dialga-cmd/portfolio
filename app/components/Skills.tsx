"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SiPython, SiCplusplus, SiTypescript, SiReact, SiNextdotjs, SiFastapi, SiVite, SiTailwindcss, SiThreedotjs, SiD3, SiNodedotjs, SiExpress, SiFlask, SiDjango, SiPostgresql, SiSupabase, SiFirebase, SiMongodb, SiRedis, SiSqlite, SiGooglegemini, SiNvidia, SiHuggingface, SiLivekit, SiLinux, SiDocker, SiGit, SiVercel, SiRender } from "react-icons/si";
import { Lock, Key, QrCode, Server, GitBranch } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { CORE_STACK, CORE_STACK_USAGE, SKILL_CATEGORIES } from "@/data/skills";
import { PROJECTS } from "@/data/projects";

const ICON_MAP: Record<string, any> = {
  Python: SiPython,
  "C++": SiCplusplus,
  C: SiCplusplus,
  TypeScript: SiTypescript,
  JavaScript: SiNodedotjs,
  Kotlin: SiNodedotjs,
  React: SiReact,
  "Next.js": SiNextdotjs,
  Vite: SiVite,
  "Tailwind CSS": SiTailwindcss,
  "Three.js": SiThreedotjs,
  "D3.js": SiD3,
  FastAPI: SiFastapi,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  Flask: SiFlask,
  Django: SiDjango,
  PostgreSQL: SiPostgresql,
  Supabase: SiSupabase,
  "Firebase Firestore": SiFirebase,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  SQLite: SiSqlite,
  ChromaDB: Server,
  "Google Gemini": SiGooglegemini,
  "NVIDIA NIM": SiNvidia,
  Groq: SiNvidia,
  "Hugging Face": SiHuggingface,
  RAG: Server,
  HMA: GitBranch,
  LiveKit: SiLivekit,
  "AES-256-GCM": Lock,
  Argon2id: Key,
  "RSA-4096": Key,
  PBKDF2: Key,
  "TPM 2.0": Lock,
  JWT: Key,
  bcrypt: Key,
  "signed QR tokens": QrCode,
  Linux: SiLinux,
  Docker: SiDocker,
  WebSockets: Server,
  "async job queues": Server,
  "AST parsing": GitBranch,
  Git: SiGit,
  Vercel: SiVercel,
  Render: SiRender,
  Firebase: SiFirebase,
  "package publishing": GitBranch,
  "code review": GitBranch,
  "release management": GitBranch,
  "semantic versioning": GitBranch,
  "contributor triage": GitBranch,
};

const TABS = [
  { key: "all", label: "All" },
  { key: "languages", label: "Languages" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "databases", label: "Databases" },
  { key: "aiMl", label: "AI / ML" },
  { key: "securityCrypto", label: "Security & Crypto" },
  { key: "systemsDevops", label: "Systems & DevOps" },
  { key: "openSource", label: "Open Source" },
] as const;

function getProjectsForSkill(skill: string) {
  return PROJECTS.filter((p) => (p.stack || []).some((s) => s.toLowerCase() === skill.toLowerCase())).map((p) => p.name);
}

export default function Skills() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const items = useMemo(() => {
    if (active === "all") {
      const all = [
        ...SKILL_CATEGORIES.languages,
        ...SKILL_CATEGORIES.frontend,
        ...SKILL_CATEGORIES.backend,
        ...SKILL_CATEGORIES.databases,
        ...SKILL_CATEGORIES.aiMl,
        ...SKILL_CATEGORIES.securityCrypto,
        ...SKILL_CATEGORIES.systemsDevops,
        ...SKILL_CATEGORIES.openSource,
      ];
      return Array.from(new Set(all));
    }
    const key = active as keyof typeof SKILL_CATEGORIES;
    return SKILL_CATEGORIES[key];
  }, [active]);

  return (
    <section id="skills" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 02" title="SKILLS" />
        <div className="mb-8">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-emerald-400/70">Core stack</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_STACK.map((skill) => {
              const Icon = ICON_MAP[skill];
              return (
                <motion.div
                  key={skill}
                  className="flex items-center gap-3 rounded-lg border border-emerald-400/40 bg-black/40 p-4 shadow-[0_0_40px_rgba(16,185,129,0.12)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4 }}
                >
                  {Icon ? <Icon className="text-xl text-emerald-300" /> : <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-400/20 text-xs">{skill.slice(0, 2)}</div>}
                  <div>
                    <p className="text-sm font-medium text-emerald-100">{skill}</p>
                    <p className="text-xs text-emerald-100/60">{CORE_STACK_USAGE[skill]}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${
                active === tab.key ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-100" : "border-emerald-400/30 text-emerald-100/70 hover:text-emerald-100"
              }`}
              role="tab"
              aria-selected={active === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((skill) => {
            const Icon = ICON_MAP[skill];
            const projects = getProjectsForSkill(skill);
            return (
              <motion.div
                key={skill}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="relative"
                onMouseEnter={() => setHovered(skill)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(skill)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
              >
                <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-emerald-400/30 bg-black/40 p-4 transition hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.14)]">
                  {Icon ? <Icon className="text-xl text-emerald-300" /> : <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-400/20 text-xs">{skill.slice(0, 2)}</div>}
                  <p className="text-center text-xs text-emerald-100/80">{skill}</p>
                </div>
                {hovered === skill && (
                  <div className="absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-lg border border-emerald-400/40 bg-black/90 p-3 text-xs text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    {projects.length === 0 ? <p className="text-emerald-100/60">Used by no listed project</p> : <ul className="flex flex-col gap-1">{projects.map((p) => <li key={p}>• {p}</li>)}</ul>}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
