"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#opensource", label: "Open Source" },
  { href: "#projects", label: "Projects" },
  { href: "#achievements", label: "Achievements" },
  { href: "#gaming", label: "Gaming" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [showGaming, setShowGaming] = useState(false);

  useEffect(() => {
    fetch("/api/steam", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok && json.data && json.data.player) {
          setShowGaming(true);
        } else if (process.env.NODE_ENV !== "production") {
          setShowGaming(true);
        }
      })
      .catch(() => {
        if (process.env.NODE_ENV !== "production") setShowGaming(true);
      });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const sections = (showGaming ? NAV_LINKS : NAV_LINKS.filter((l) => l.href !== "#gaming")).map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActive(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [showGaming]);

  const links = showGaming ? NAV_LINKS : NAV_LINKS.filter((l) => l.href !== "#gaming");

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all ${
        scrolled ? "bg-[#050d0a]/80 backdrop-blur-md shadow-[0_1px_0_rgba(16,185,129,0.25)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="#hero" className="text-sm font-semibold tracking-tight text-emerald-100">
          ADITYA RAJ
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm text-emerald-100/80 transition hover:text-emerald-200 ${
                active === link.href.slice(1) ? "text-emerald-200" : ""
              }`}
            >
              {link.label}
              {active === link.href.slice(1) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-px w-full bg-emerald-400"
                />
              )}
            </Link>
          ))}
          <Link
            href="#contact"
            className="rounded-full border border-emerald-400/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-emerald-100 transition hover:bg-emerald-400/10"
          >
            LET&apos;S TALK
          </Link>
        </div>
        <button
          className="md:hidden text-emerald-100"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-emerald-400/20 bg-[#050d0a]/95 backdrop-blur-md">
          <div className="flex flex-col gap-3 px-6 py-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm text-emerald-100/80">
                {link.label}
              </Link>
            ))}
            <Link href="#contact" onClick={() => setOpen(false)} className="text-sm text-emerald-200">
              LET&apos;S TALK
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
