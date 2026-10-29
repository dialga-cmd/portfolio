"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import SectionPose from "./SectionPose";

const REPOS = [
  {
    title: "GUN101",
    desc: "Password-based AES-256-GCM encryption with Argon2id.",
    href: "https://github.com/dialga-cmd/gun101",
  },
  {
    title: "GUN101-GKP (Ghost Key Protocol)",
    desc: "Passwordless RSA-4096 + AES-256-GCM file encryption.",
    href: "https://github.com/dialga-cmd/GUN101-GKP",
  },
  {
    title: "GUN101-TPM",
    desc: "TPM 2.0 hardware-bound encryption.",
    href: "https://github.com/dialga-cmd/GUN101-TPM",
  },
];

const PYPI = ["gun101", "gun101-gkp", "gun101-tpm", "hma"];

export default function OpenSource() {
  return (
    <section id="opensource" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 03" title="OPEN SOURCE" />
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <motion.p
              className="text-base text-emerald-100/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
            >
              Maintainer of 3 repositories and 4 PyPI packages.
            </motion.p>
            <div className="grid gap-4 sm:grid-cols-3">
              {REPOS.map((repo, idx) => (
                <motion.a
                  key={repo.title}
                  href={repo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-emerald-400/30 bg-black/40 p-4 transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.16)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <p className="text-sm font-medium text-emerald-100">{repo.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-100/70">{repo.desc}</p>
                </motion.a>
              ))}
            </div>
            <motion.ul
              className="flex flex-col gap-2 text-sm text-emerald-100/75"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <li>• Maintain threat models, security policies, test vectors, contributing guidelines, governance docs, and reproducible dependency configs.</li>
              <li>• Managed external contributions, reviewed and merged community PRs, security validation, PyPI release management.</li>
              <li>• The protocol has undergone external review with documented responses; shipped release v2.1.2.</li>
            </motion.ul>
            <motion.div
              className="flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <span className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">PyPI</span>
              {PYPI.map((pkg) => (
                <span key={pkg} className="rounded-full border border-emerald-400/30 px-2.5 py-1 text-xs text-emerald-100/80">
                  {pkg}
                </span>
              ))}
            </motion.div>
          </div>
          <div className="flex justify-center">
            <SectionPose name="opensource" />
          </div>
        </div>
      </div>
    </section>
  );
}
