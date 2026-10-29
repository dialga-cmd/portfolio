"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { skillIconMap } from "@/data/icons";

const CURSOR_TILT = false;

const STATS = [
  "4 PyPI packages",
  "3 crypto repos",
  "Top 310 / 46,000+ hackathon",
  "IIT Madras B.S. '29",
];

const BADGES = [
  { name: "Python" },
  { name: "C++" },
  { name: "TypeScript" },
  { name: "React" },
  { name: "Next.js" },
  { name: "Three.js" },
];

const LINES = ["Hi, I'm Aditya", "I build secure software", "Scroll down to see my work"];

export default function Hero() {
  const reduce = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    const line = LINES[lineIndex];
    let i = 0;
    setText("");
    const id = window.setInterval(() => {
      i += 1;
      setText(line.slice(0, i));
      if (i >= line.length) {
        window.clearInterval(id);
        window.setTimeout(() => {
          setLineIndex((prev) => (prev + 1) % LINES.length);
        }, 1400);
      }
    }, 38);
    return () => window.clearInterval(id);
  }, [lineIndex, reduce]);

  useEffect(() => {
    if (!CURSOR_TILT || reduce) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  const tilt = useMemo(() => {
    if (!CURSOR_TILT || reduce) return "rotateX(0deg) rotateY(0deg)";
    return `rotateX(${-mouse.y * 6}deg) rotateY(${mouse.x * 6}deg)`;
  }, [mouse, reduce]);

  return (
    <section id="hero" className="relative min-h-screen pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-sm uppercase tracking-[0.4em] text-emerald-400/80">// HELLO, WORLD</span>
          <h1 className="font-[var(--font-display)] text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-tight text-emerald-100">
            ADITYA RAJ
          </h1>
          <p className="text-lg text-emerald-100/80 sm:text-xl">Full-Stack Engineer &amp; Open Source Maintainer</p>
          <p className="max-w-xl text-base leading-relaxed text-emerald-100/70" style={{ maxWidth: "65ch" }}>
            Self-taught engineer building across cryptography, developer tooling, AI systems, computer vision, and production web. Focused on secure protocols and pragmatic developer experiences.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="#projects" className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-300">
              View Projects
            </Link>
            <Link href="#contact" className="rounded-full border border-emerald-400/70 px-6 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/10">
              Get in touch
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATS.map((stat) => (
              <div key={stat} className="rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1 text-xs text-emerald-100/80 backdrop-blur-sm">
                {stat}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative mb-4">
            <div className="relative rounded-2xl border border-emerald-400/40 bg-black/40 px-4 py-2 text-sm text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.18)]">
              <span>{reduce ? LINES[lineIndex] : text}</span>
              {!reduce && <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-emerald-300 align-middle" />}
              <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-emerald-400/40 bg-black/40" />
            </div>
          </div>

          <div className="relative flex items-center justify-center" style={{ perspective: "1000px" }}>
            <div
              className="relative"
              style={{
                transform: tilt,
                transition: "transform 200ms ease-out",
              }}
            >
              <motion.div
                className="relative flex h-[60vh] max-h-[560px] min-h-[320px] w-[80vw] max-w-[420px] items-end justify-center sm:w-[380px]"
                animate={reduce ? {} : { scaleY: [1, 1.015, 1], y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/chibi/hero-wave.png"
                  alt="Aditya chibi"
                  fill
                  sizes="(max-width: 640px) 60vw, 420px"
                  style={{ objectFit: "contain" }}
                  draggable={false}
                  priority
                />
              </motion.div>
              <div className="absolute -bottom-6 left-1/2 h-12 w-56 -translate-x-1/2 rounded-[50%] bg-emerald-400/12 blur-md sm:w-64" />
              <div className="absolute -bottom-4 left-1/2 h-4 w-44 -translate-x-1/2 rounded-[50%] bg-emerald-400/25 sm:w-52" />
            </div>

            {!reduce && (
              <motion.div
                className="absolute h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                {BADGES.map((badge, i) => {
                  const angle = (i / BADGES.length) * Math.PI * 2;
                  const radiusX = 190;
                  const radiusY = 140;
                  const x = Math.cos(angle) * radiusX;
                  const y = Math.sin(angle) * radiusY;
                  const behind = Math.sin(angle) < 0;
                  const Icon = skillIconMap[badge.name];
                  return (
                    <div
                      key={badge.name}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        opacity: behind ? 0.45 : 1,
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                        zIndex: behind ? 0 : 10,
                      }}
                    >
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/70 bg-[#0a1510] shadow-[0_0_30px_rgba(16,185,129,0.18)]"
                        style={{ transform: "rotate(-360deg)" }}
                      >
                        {Icon ? <Icon size={22} className="text-emerald-300" /> : <span className="font-mono text-[10px] text-emerald-200">{badge.name.slice(0, 2)}</span>}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
