export interface SuiteEntry {
  name: string;
  repo: string;
  repoUrl: string;
  usedSkills: string[];
}

export const SUITE: SuiteEntry[] = [
  {
    name: "GUN101",
    repo: "GUN101",
    repoUrl: "https://github.com/dialga-cmd/GUN101",
    usedSkills: ["Python", "AES-256-GCM", "Argon2id"],
  },
  {
    name: "GUN101-GKP",
    repo: "gun101-gkp",
    repoUrl: "https://github.com/dialga-cmd/gun101-gkp",
    usedSkills: ["Python", "RSA-4096", "AES-256-GCM"],
  },
  {
    name: "GUN101-TPM",
    repo: "gun101-tpm",
    repoUrl: "https://github.com/dialga-cmd/gun101-tpm",
    usedSkills: ["Python", "TPM 2.0", "Argon2id", "AES-256-GCM", "Linux"],
  },
];

export const SUITE_SKILLS = ["package publishing", "code review", "release management", "semantic versioning", "contributor triage"];
