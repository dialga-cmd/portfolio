"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { CHIBI_CONFIG, CHIBI_LAYERS } from "./chibi.config";
import LayerImg from "./LayerImg";

const PLAYER_NAME = "YOUR NAME";

type ClickIcon = { id: number; x: number; y: number; emoji: string };

const CLICK_ICONS = ["⬢", "✦", "</>", "✚", "⚡", "★"];

/** Breathes the body (scaleY 1 -> 1.02) over 3s, loops. */
const bodyBreath = (reduced: boolean) =>
  reduced
    ? { scaleY: 1 }
    : {
        scaleY: [1, 1.02, 1],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
      };

/** Hair/scarf sway with a gentle rotation. */
const sway = (reduced: boolean) =>
  reduced
    ? { rotate: 0 }
    : {
        rotate: [0, 1.2, -1, 0.8, 0],
        transition: { duration: 4.6, repeat: Infinity, ease: "easeInOut" as const },
      };

/** Headset ring glow pulse. */
const headsetPulse = (reduced: boolean) =>
  reduced
    ? { filter: "none" }
    : {
        filter: ["drop-shadow(0 0 0px rgba(34,211,238,0))", "drop-shadow(0 0 10px rgba(34,211,238,0.7))", "drop-shadow(0 0 0px rgba(34,211,238,0))"],
        transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
      };

export default function Chibi() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* Cursor follow: head + slight body shift. */
  const headX = useSpring(0, { stiffness: 160, damping: 16 });
  const headY = useSpring(0, { stiffness: 160, damping: 16 });
  const headRot = useSpring(0, { stiffness: 140, damping: 14 });
  const bodyX = useSpring(0, { stiffness: 120, damping: 16 });

  /* States: blink, sunglasses-lift, mouth-open, wave, yawn, bob. */
  const [blink, setBlink] = useState(false);
  const [sunglassesUp, setSunglassesUp] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [armWave, setArmWave] = useState(false);
  const [yawn, setYawn] = useState(false);
  const [headBob, setHeadBob] = useState(false);
  const [clickIcons, setClickIcons] = useState<ClickIcon[]>([]);
  const [dropIn, setDropIn] = useState(true);

  /* Entrance: drop in from above with a bounce. */
  useEffect(() => {
    const t = setTimeout(() => setDropIn(false), 720);
    return () => clearTimeout(t);
  }, []);

  /* Blink at random 2–5s intervals. Sunglasses lift briefly when blinking. */
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 2000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setBlink(true);
        if (!reduce) setSunglassesUp(true);
        setTimeout(() => {
          setBlink(false);
          if (!reduce) setSunglassesUp(false);
        }, 120);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [reduce]);

  /* Random idle action every 8s of inactivity. */
  useEffect(() => {
    if (reduce) return;
    let last = Date.now();
    const onActivity = () => {
      last = Date.now();
    };
    window.addEventListener("pointermove", onActivity);
    window.addEventListener("click", onActivity);
    const interval = setInterval(() => {
      if (Date.now() - last < 8000) return;
      const actions = ["wave", "yawn", "bob"] as const;
      const action = actions[Math.floor(Math.random() * actions.length)];
      if (action === "wave") {
        setArmWave(true);
        setTimeout(() => setArmWave(false), 900);
      } else if (action === "yawn") {
        setYawn(true);
        setMouthOpen(true);
        setTimeout(() => {
          setYawn(false);
          if (!hovered) setMouthOpen(false);
        }, 1200);
      } else if (action === "bob") {
        setHeadBob(true);
        setTimeout(() => setHeadBob(false), 800);
      }
      last = Date.now();
    }, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("pointermove", onActivity);
      window.removeEventListener("click", onActivity);
    };
  }, [reduce, hovered]);

  /* Cursor follow. */
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
      headX.set(dx * 10);
      headY.set(dy * 10);
      headRot.set(dx * 8);
      bodyX.set(dx * 2.5);
    };
    const onLeave = () => {
      headX.set(0);
      headY.set(0);
      headRot.set(0);
      bodyX.set(0);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, headX, headY, headRot, bodyX]);

  const onHoverStart = useCallback(() => {
    setHovered(true);
    if (!reduce) {
      setSunglassesUp(true);
      setMouthOpen(true);
    }
  }, [reduce]);

  const onHoverEnd = useCallback(() => {
    setHovered(false);
    if (!reduce) {
      if (!blink) setSunglassesUp(false);
      setMouthOpen(false);
    }
  }, [reduce, blink]);

  const onClick = useCallback(() => {
    if (reduce) return;
    setArmWave(true);
    setTimeout(() => setArmWave(false), 900);
    setClickIcons((prev) => [
      ...prev,
      ...Array.from({ length: 6 + Math.floor(Math.random() * 3) }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 60,
        y: -40 - Math.random() * 30,
        emoji: CLICK_ICONS[Math.floor(Math.random() * CLICK_ICONS.length)],
      })),
    ]);
    setTimeout(() => setClickIcons([]), 900);
  }, [reduce]);

  const layers = useMemo(() => CHIBI_LAYERS, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative flex h-[320px] w-[260px] select-none items-end justify-center sm:h-[380px] sm:w-[320px] lg:h-[420px] lg:w-[340px]"
      initial={dropIn ? { y: -220, scale: 0.9 } : { y: 0, scale: 1 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 14, mass: 0.8 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Platform ellipse with soft shadow */}
      <div className="absolute -bottom-6 left-1/2 h-10 w-40 -translate-x-1/2 rounded-[50%] bg-emerald-400/10 blur-md sm:w-48" />
      <div className="absolute -bottom-4 left-1/2 h-4 w-32 -translate-x-1/2 rounded-[50%] bg-emerald-400/20 sm:w-36" />

      {/* Head/torso group */}
      <motion.div
        className="absolute bottom-10 h-full w-full"
        animate={bodyBreath(!!reduce)}
        style={{ x: bodyX }}
      >
        {/* Render all layers */}
        {layers.map((key) => {
          const cfg = CHIBI_CONFIG[key];
          let visible = cfg.visibleByDefault;

          if (key === "eyes-open") visible = !blink;
          if (key === "eyes-closed") visible = blink;
          if (key === "mouth-smile") visible = !mouthOpen;
          if (key === "mouth-open") visible = mouthOpen;

          if (!visible) return null;

          if (key === "head") {
            return (
              <motion.div
                key={key}
                className="absolute inset-0"
                style={{ x: headX, y: headY, rotate: headRot, zIndex: cfg.zIndex }}
                animate={headBob && !reduce ? { y: [headY.get(), headY.get() - 6, headY.get()] } : {}}
                transition={{ duration: 0.4 }}
              >
                <LayerImg src={cfg.src} alt="head" />
              </motion.div>
            );
          }

          if (key === "hair") {
            return (
              <motion.div
                key={key}
                className="absolute inset-0"
                style={{ x: headX, y: headY, zIndex: cfg.zIndex }}
                animate={sway(!!reduce)}
              >
                <LayerImg src={cfg.src} alt="hair" />
              </motion.div>
            );
          }

          if (key === "scarf") {
            return (
              <motion.div
                key={key}
                className="absolute inset-0"
                style={{ zIndex: cfg.zIndex }}
                animate={sway(!!reduce)}
              >
                <LayerImg src={cfg.src} alt="scarf" />
              </motion.div>
            );
          }

          if (key === "headset") {
            return (
              <motion.div
                key={key}
                className="absolute inset-0"
                style={{ x: headX, y: headY, zIndex: cfg.zIndex }}
                animate={headsetPulse(!!reduce)}
              >
                <LayerImg src={cfg.src} alt="headset" />
              </motion.div>
            );
          }

          if (key === "sunglasses") {
            return (
              <motion.div
                key={key}
                className="absolute inset-0"
                style={{ x: headX, zIndex: cfg.zIndex }}
                initial={{ y: 0 }}
                animate={{
                  y: sunglassesUp && !reduce ? -14 : headY.get() + (yawn ? -2 : 0),
                }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <LayerImg src={cfg.src} alt="sunglasses" />
              </motion.div>
            );
          }

          if (key === "arm-right") {
            return (
              <motion.div
                key={key}
                className="absolute inset-0"
                style={{ zIndex: cfg.zIndex }}
                initial={{ rotate: 0 }}
                animate={{ rotate: armWave && !reduce ? [0, -24, 0, -18, 0] : yawn && !reduce ? -6 : 0 }}
                transition={{ duration: armWave ? 0.9 : 0.4 }}
              >
                <LayerImg src={cfg.src} alt="arm-right" />
              </motion.div>
            );
          }

          return (
            <div key={key} className="absolute inset-0" style={{ zIndex: cfg.zIndex }}>
              <LayerImg src={cfg.src} alt={key} />
            </div>
          );
        })}
      </motion.div>

      {/* Speech bubble on hover */}
      <motion.div
        className="absolute -top-14 left-1/2 -translate-x-1/2 rounded-lg border border-emerald-400/40 bg-black/70 px-3 py-1 text-xs text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: hovered && !reduce ? 1 : 0, y: hovered && !reduce ? 0 : 10, scale: hovered && !reduce ? 1 : 0.9 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
      >
        hey!
        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-emerald-400/40 bg-black/70" />
      </motion.div>

      {/* Click icons */}
      {clickIcons.map((icon) => (
        <motion.span
          key={icon.id}
          className="absolute bottom-20 text-sm text-emerald-200"
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
