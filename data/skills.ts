export const SKILL_CATEGORIES = {
  languages: ["Python", "C++", "C", "TypeScript", "JavaScript", "Kotlin"],
  frontend: ["React", "Next.js", "Vite", "Tailwind CSS", "Three.js", "D3.js"],
  backend: ["FastAPI", "Node.js", "Express", "Flask", "Django"],
  databases: ["PostgreSQL", "Supabase", "Firebase Firestore", "MongoDB", "Redis", "SQLite", "ChromaDB"],
  aiMl: ["Google Gemini", "NVIDIA NIM", "Groq", "Hugging Face", "RAG", "HMA", "LiveKit"],
  securityCrypto: ["AES-256-GCM", "Argon2id", "RSA-4096", "PBKDF2", "TPM 2.0", "JWT", "bcrypt", "signed QR tokens"],
  systemsDevops: ["Linux", "Docker", "WebSockets", "async job queues", "AST parsing", "Git", "Vercel", "Render", "Firebase"],
  openSource: ["package publishing", "code review", "release management", "semantic versioning", "contributor triage"],
} as const;

export const SKILLS = SKILL_CATEGORIES;

export type SkillCategoryKey = keyof typeof SKILL_CATEGORIES;

export const CORE_STACK = ["Python", "C++", "TypeScript", "React", "Next.js", "FastAPI"] as const;

export const CORE_STACK_USAGE: Record<string, string> = {
  Python: "Automation, tooling & AI pipelines",
  "C++": "High-performance systems & vision",
  TypeScript: "Type-safe full-stack apps",
  React: "Interactive UIs & components",
  "Next.js": "SSR, routing & full-stack web",
  FastAPI: "APIs, auth & async services",
};
