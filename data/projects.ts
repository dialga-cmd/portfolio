export interface Project {
  title: string;
  summary: string;
  bullets: string[];
  stack: string[];
  github?: string;
  featured?: boolean;
  isSuite?: boolean;
}

export const PROJECTS: Project[] = [
  {
    title: "CodeLens",
    summary:
      "AI Codebase Intelligence & 3D Visualization. Clones GitHub repos, parses source with Tree-sitter, and renders interactive 3D graphs.",
    bullets: [
      "Extracts file and dependency relationships, detects architectural hotspots",
      "AI layer for contextual codebase queries with interactive 3D visualization",
    ],
    stack: ["Next.js", "React", "FastAPI", "Python", "Tree-sitter", "Three.js", "React Force Graph", "Firebase", "Gemini"],
    github: "https://github.com/dialga-cmd/CodeLens",
    featured: true,
  },
  {
    title: "HMA",
    summary: "Retrieval-Augmented Hierarchy. A structural alternative to chunk-based RAG that builds a knowledge map of files, imports, configs and docs.",
    bullets: [
      "Routes queries to relevant files, no vector DB or embeddings required",
      "Offline indexing, LLM-based file routing, single-hop graph traversal, Python API/CLI",
    ],
    stack: ["Python", "AST parsing", "LLM APIs", "PyMuPDF", "python-docx"],
    github: "https://github.com/dialga-cmd/hma",
  },
  {
    title: "LucidGrasp",
    summary: "C++ Image Search & Computer Vision. Cross-platform image search for visually similar images including edited variants.",
    bullets: [
      "Weighted SSIM + ORB keypoints + HSV histogram matching with two-stage ranking",
      "Background threading for fast, responsive search",
    ],
    stack: ["C++", "OpenCV", "Qt6", "CMake"],
    github: "https://github.com/dialga-cmd/LucidGrasp",
  },
  {
    title: "GUN101 / GUN101-GKP / GUN101-TPM",
    summary: "Cryptographic suite of secure file encryption protocols (see suite above).",
    bullets: ["Password-based and passwordless encryption flows", "Hardware-bound encryption via TPM 2.0"],
    stack: ["Python", "AES-256-GCM", "Argon2id", "RSA-4096", "TPM 2.0"],
    isSuite: true,
  },
];
