"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { EMAIL, GITHUB, LINKEDIN, WEBSITE } from "@/data/site";

const CARDS = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "GitHub", value: GITHUB.replace("https://", ""), href: GITHUB },
  { label: "LinkedIn", value: "linkedin.com/in/aditya-raj-407a0740a", href: LINKEDIN },
  { label: "Website", value: WEBSITE.replace("https://", ""), href: WEBSITE },
  { label: "Location", value: "Ranchi, India", href: null },
];

export default function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 07" title="CONTACT" />
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-emerald-100 sm:text-3xl">Let&apos;s build something.</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              {card.href ? (
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block rounded-lg border border-emerald-400/30 bg-black/40 p-4 transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.16)]"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">{card.label}</p>
                  <p className="mt-2 text-sm text-emerald-100">{card.value}</p>
                </a>
              ) : (
                <div className="rounded-lg border border-emerald-400/30 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">{card.label}</p>
                  <p className="mt-2 text-sm text-emerald-100">{card.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <a href="/resume.pdf" download className="inline-flex items-center gap-2 rounded-full border border-emerald-400/70 px-6 py-2.5 text-sm text-emerald-100 transition hover:bg-emerald-400/10">
            Download resume
          </a>
        </motion.div>
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-emerald-400/20 pt-6 sm:flex-row">
          <p className="text-sm text-emerald-100/60">© 2026 Aditya Raj</p>
          <Link href="#hero" className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">
            Back to top
          </Link>
        </footer>
      </div>
    </section>
  );
}
