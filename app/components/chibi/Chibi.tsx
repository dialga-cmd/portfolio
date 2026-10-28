"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { POSES } from "./poses";

const CLICK_ICONS = ["⬢", "✦", "</>", "✚", "⚡", "★"];

type ClickIcon = { id: number; x: number; y: number; emoji: string };

export default function Chibi() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const headX = useSpring(0, { stiffness: 140, damping: 16 });
  const headY = useSpring(0, { stiffness: 140, damping: 16 });
  const headRot = useSpring(0, { stiffness: 120, damping: 14 });

  const [pose, setPose] = useState<(typeof POSES)[keyof typeof POSES]>(POSES.idle);
  const [blink, setBlink] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clickIcons, setClickIcons] = useState<ClickIcon[]>([]);
  const [dropIn, setDropIn] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDropIn(false), 650);
    return () => clearTimeout(t);
  }, []);

  // Blink at random 2–5s intervals
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 2000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        if (pose === POSES.idle) {
          setBlink(true);
          setPose(POSES.blink);
          setTimeout(() => {
            setBlink(false);
            setPose(POSES.idle);
          }, 140);
        }
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [pose]);

  // Random idle action every 8s
  useEffect(() => {
    if (reduce) return;
    let last = Date.now();
    const onActivity = () => { last = Date.now(); };
    window.addEventListener("pointermove", onActivity);
    window.addEventListener("click", onActivity);
    const interval = setInterval(() => {
      if (Date.now() - last < 8000) return;
      if (pose !== POSES.idle && pose !== POSES.blink) return;
      const actions = [POSES.wave, POSES.think, POSES.gaming] as const;
      const next = actions[Math.floor(Math.random() * actions.length)];
      setPose(next);
      setTimeout(() => setPose(POSES.idle), 1400);
      last = Date.now();
    }, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("pointermove", onActivity);
      window.removeEventListener("click", onActivity);
    };
  }, [reduce, pose]);

  // Cursor follow
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      headX.set(dx * 8);
      headY.set(dy * 8);
      headRot.set(dx * 6);
    };
    const onLeave = () => {
      headX.set(0);
      headY.set(0);
      headRot.set(0);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, headX, headY, headRot]);

  const onHoverStart = useCallback(() => {
    setHovered(true);
    if (!reduce && (pose === POSES.idle || pose === POSES.blink)) {
      setPose(POSES.wave);
      setTimeout(() => setPose(POSES.idle), 900);
    }
  }, [reduce, pose]);

  const onHoverEnd = useCallback(() => {
    setHovered(false);
  }, []);

  const onClick = useCallback(() => {
    if (reduce) return;
    const actions = [POSES.celebrate, POSES.wave] as const;
    setPose(actions[Math.floor(Math.random() * actions.length)]);
    setClickIcons((prev) => [
      ...prev,
      ...Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 70,
        y: -50 - Math.random() * 40,
        emoji: CLICK_ICONS[Math.floor(Math.random() * CLICK_ICONS.length)],
      })),
    ]);
    setTimeout(() => setClickIcons([]), 900);
    setTimeout(() => setPose(POSES.idle), 1200);
  }, [reduce]);

  return (
    <motion.div
      ref={containerRef}
      className="relative flex h-[340px] w-[280px] select-none items-end justify-center sm:h-[420px] sm:w-[340px] lg:h-[480px] lg:w-[380px]"
      initial={dropIn ? { y: -200, scale: 0.9 } : { y: 0, scale: 1 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 14, mass: 0.8 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="absolute -bottom-6 left-1/2 h-10 w-40 -translate-x-1/2 rounded-[50%] bg-emerald-400/10 blur-md sm:w-52" />
      <div className="absolute -bottom-4 left-1/2 h-4 w-36 -translate-x-1/2 rounded-[50%] bg-emerald-400/20 sm:w-44" />

      <motion.div
        className="relative h-full w-full"
        style={{ x: headX, y: headY, rotate: headRot }}
      >
        <Image
          src={pose}
          alt="Chibi character"
          fill
          sizes="(max-width: 640px) 70vw, 380px"
          style={{ objectFit: "contain" }}
          draggable={false}
          priority
        />
      </motion.div>

      <motion.div
        className="absolute -top-16 left-1/2 -translate-x-1/2 rounded-lg border border-emerald-400/40 bg-black/70 px-3 py-1 text-xs text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: hovered && !reduce ? 1 : 0, y: hovered && !reduce ? 0 : 10, scale: hovered && !reduce ? 1 : 0.9 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
      >
        hey!
        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-emerald-400/40 bg-black/70" />
      </motion.div>

      {clickIcons.map((icon) => (
        <motion.span
          key={icon.id}
          className="absolute bottom-24 text-sm text-emerald-200"
          initial={{ x: icon.x, y: 0, opacity: 0.9, scale: 0.6 }}
          animate={{ y: icon.y, opacity: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {icon.emoji}
        </motion.span>
      ))}
    </motion.div>
  );
}
