"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skillIconMap } from "@/data/icons";
import { SUITE, SUITE_SKILLS } from "@/data/suite";
import SectionHeading from "./SectionHeading";
import { CORE_STACK, CORE_STACK_USAGE } from "@/data/skills";
import { PROJECTS } from "@/data/projects";
import { IconType } from "react-icons";
import { Lock, KeyRound, Fingerprint, Cpu, BadgeCheck, DatabaseZap, Network, Plug, ListOrdered, Braces } from "lucide-react";

const FALLBACK_ICONS: Record<string, IconType> = {
  "AES-256-GCM": Lock,
  Argon2id: Fingerprint,
  "RSA-4096": KeyRound,
  "TPM 2.0": Cpu,
  JWT: BadgeCheck,
  RAG: DatabaseZap,
  HMA: Network,
  WebSockets: Plug,
  "async job queues": ListOrdered,
  "AST parsing": Braces,
  "package publishing": Braces,
  "code review": Braces,
  "release management": Braces,
  "semantic versioning": Braces,
  "contributor triage": Braces,
};

const ALLOWED_SKILLS = new Set([
  "Python", "C++", "TypeScript", "JavaScript",
  "React", "Next.js", "Vite", "Tailwind CSS", "Three.js",
  "FastAPI", "Node.js", "Express", "Flask", "Supabase", "Firebase Firestore", "Redis",
  "Google Gemini", "NVIDIA NIM", "Hugging Face", "RAG", "HMA",
  "AES-256-GCM", "Argon2id", "RSA-4096", "TPM 2.0", "JWT",
  "Linux", "Docker", "WebSockets", "async job queues", "AST parsing", "Vercel", "Render", "Firebase",
  "package publishing", "code review", "release management", "semantic versioning", "contributor triage",
]);

const TABS = [
  { key: "all", label: "All" },
  { key: "languages", label: "Languages" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend & Data" },
  { key: "aiMl", label: "AI / ML" },
  { key: "securityCrypto", label: "Security & Crypto" },
  { key: "systemsDevops", label: "Systems & DevOps" },
  { key: "openSource", label: "Open Source" },
] as const;

const TAB_MAP: Record<string, string[]> = {
  languages: ["Python", "C++", "TypeScript", "JavaScript"],
  frontend: ["React", "Next.js", "Vite", "Tailwind CSS", "Three.js"],
  backend: ["FastAPI", "Node.js", "Express", "Flask", "Supabase", "Firebase Firestore", "Redis", "Firebase"],
  aiMl: ["Google Gemini", "NVIDIA NIM", "Hugging Face", "RAG", "HMA"],
  securityCrypto: ["AES-256-GCM", "Argon2id", "RSA-4096", "TPM 2.0", "JWT"],
  systemsDevops: ["Linux", "Docker", "WebSockets", "async job queues", "AST parsing", "Vercel", "Render", "Firebase"],
  openSource: ["package publishing", "code review", "release management", "semantic versioning", "contributor triage"],
};

const LANG_COLORS: Record<string, string> = {
  Python: "bg-yellow-400",
  "C++": "bg-blue-400",
  C: "bg-blue-400",
  TypeScript: "bg-cyan-400",
  JavaScript: "bg-amber-400",
};

function normalizeSkill(s: string) {
  const lower = s.toLowerCase().trim();
  if (lower === "gemini") return "Google Gemini";
  if (lower === "firebase" || lower === "firebase firestore") return "Firebase";
  if (lower === "tailwind" || lower === "tailwind css") return "Tailwind CSS";
  if (lower === "three" || lower === "three.js") return "Three.js";
  return s.trim();
}

function getMatches(skill: string) {
  const norm = normalizeSkill(skill);
  const results: Array<{ name: string; href?: string; lang?: string }> = [];
  for (const p of PROJECTS) {
    const used = (p.usedSkills || []).map(normalizeSkill);
    if (used.includes(norm)) {
      results.push({ name: p.name, href: p.repoUrl, lang: p.language });
    }
  }
  for (const s of SUITE) {
    const used = (s.usedSkills || []).map(normalizeSkill);
    if (used.includes(norm)) {
      results.push({ name: s.name, href: s.repoUrl, lang: "Python" });
    }
  }
  if (SUITE_SKILLS.includes(norm)) {
    for (const s of SUITE) {
      results.push({ name: s.name, href: s.repoUrl, lang: "Python" });
    }
  }
  const seen = new Set<string>();
  const unique = results.filter((r) => {
    const key = r.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique;
}

export default function Skills() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const items = useMemo(() => {
    if (active === "all") {
      const all = [
        "Python", "C++", "TypeScript", "JavaScript",
        "React", "Next.js", "Vite", "Tailwind CSS", "Three.js",
        "FastAPI", "Node.js", "Express", "Flask", "Supabase", "Firebase Firestore", "Redis",
        "Google Gemini", "NVIDIA NIM", "Hugging Face", "RAG", "HMA",
        "AES-256-GCM", "Argon2id", "RSA-4096", "TPM 2.0", "JWT",
        "Linux", "Docker", "WebSockets", "async job queues", "AST parsing", "Vercel", "Render", "Firebase",
        "package publishing", "code review", "release management", "semantic versioning", "contributor triage",
      ];
      return all.filter((s) => ALLOWED_SKILLS.has(s));
    }
    const key = active as keyof typeof TAB_MAP;
    return TAB_MAP[key].filter((s) => ALLOWED_SKILLS.has(s));
  }, [active]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    for (const skill of items) {
      if (getMatches(skill).length === 0) {
        console.error(`SKILLS: ${skill} has zero matches`);
      }
    }
  }, [items]);

  return (
    <section id="skills" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 02" title="SKILLS" />
        <div className="mb-8">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-emerald-400/70">Core stack</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_STACK.map((skill) => {
              const Icon = skillIconMap[skill] || FALLBACK_ICONS[skill];
              return (
                <motion.div
                  key={skill}
                  className="flex items-center gap-3 rounded-lg border border-emerald-400/40 bg-black/40 p-4 shadow-[0_0_40px_rgba(16,185,129,0.12)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4 }}
                >
                  {Icon ? <Icon size={18} className="text-emerald-300" /> : <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-400/20 font-mono text-[10px]">{skill.slice(0, 2)}</div>}
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
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${
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
            const Icon = skillIconMap[skill] || FALLBACK_ICONS[skill];
            const matches = getMatches(skill);
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
                  {Icon ? <Icon size={20} className="text-emerald-300" /> : <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-400/20 font-mono text-xs">{skill.slice(0, 2)}</div>}
                  <p className="text-center text-xs text-emerald-100/80">{skill}</p>
                </div>
                {hovered === skill && matches.length > 0 && (
                  <div className="absolute left-1/2 top-full z-[100] mt-2 w-56 -translate-x-1/2 rounded-lg border border-emerald-400/40 bg-[#050d0a] p-3 text-xs text-[var(--foreground)] shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <ul className="flex flex-col gap-1.5">
                      {matches.slice(0, 4).map((m, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          {m.lang && <span className={`h-1.5 w-1.5 rounded-full ${LANG_COLORS[m.lang] || "bg-emerald-400"}`} />}
                          {m.href ? (
                            <a href={m.href} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300">
                              {m.name}
                            </a>
                          ) : (
                            <span>{m.name}</span>
                          )}
                        </li>
                      ))}
                      {matches.length > 4 && <li className="text-emerald-100/50">+{matches.length - 4} more</li>}
                    </ul>
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
