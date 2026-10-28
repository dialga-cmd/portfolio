"use client";

import { useEffect, useRef } from "react";
import NextImage from "next/image";
import styles from "./page.module.css";

const RING = 520; // SVG viewBox size; outer radius 260
const REVEAL_RADIUS = 260;

/* ================= flying terminal code ================= */

interface Particle {
  text: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  drift: number;
}

const GLYPHS = ["</>", "{ }", "01", "++", "==", ";;", "fn", "=>", "0xFF", "#!", "0b1", "let"];

function randomParticle(w: number, h: number): Particle {
  return {
    text: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    x: Math.random() * w,
    y: Math.random() * h,
    speed: 0.35 + Math.random() * 1.1,
    size: 10 + Math.random() * 14,
    opacity: 0.2 + Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 0.5,
  };
}

/* ================= gamer field (orbiting symbols + stars) ================= */

interface OrbitGlyph {
  text: string;
  radius: number;
  angle: number;
  speed: number;
  size: number;
  phase: number;
}

function makeGamerField(): {
  glyphs: OrbitGlyph[];
  stars: { x: number; y: number; p: number }[];
} {
  const set = ["⬢", "▲", "✦", "♥", "▣", "◉", "⬡", "✚", "⚡", "»"];
  const glyphs = Array.from({ length: 26 }, (): OrbitGlyph => ({
    text: set[Math.floor(Math.random() * set.length)],
    radius: 0.12 + Math.random() * 0.85,
    angle: Math.random() * Math.PI * 2,
    speed: 0.15 + Math.random() * 0.4,
    size: 10 + Math.random() * 10,
    phase: Math.random() * Math.PI * 2,
  }));
  const stars = Array.from({ length: 40 }, () => ({
    x: Math.random(),
    y: Math.random(),
    p: Math.random() * Math.PI * 2,
  }));
  return { glyphs, stars };
}

/* ================= morphing blob ================= */

const B = 18;

function randomShape() {
  return {
    control: Array.from({ length: B }, () => 0.5 + Math.random() * 0.6),
    phase: Array.from({ length: B }, () => Math.random() * Math.PI * 2),
    amp: Array.from({ length: B }, () => 0.08 + Math.random() * 0.22),
  };
}

function catmullRing(points: { x: number; y: number }[]): string {
  const n = points.length;
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d + " Z";
}

function blobPath(
  shape: { control: number[]; phase: number[]; amp: number[] },
  radius: number,
  time: number,
  smoothing: number[]
): string {
  const pts = smoothing.map((v, i) => {
    const goal =
      radius * shape.control[i] * (1 + shape.amp[i] * Math.sin(time * 1.2 + shape.phase[i]));
    return v + (goal - v) * 0.08;
  });
  const ring = pts.map((r, i) => {
    const a = (i / B) * Math.PI * 2;
    return { x: 260 + r * Math.cos(a), y: 260 + r * Math.sin(a) };
  });
  return catmullRing(ring);
}

/* ================= component ================= */

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const blobRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = blobRef.current;
    if (!canvas || !svg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const parts: Particle[] = Array.from({ length: 34 }, () =>
      randomParticle(window.innerWidth, window.innerHeight)
    );
    const field = makeGamerField();

    const nativeImage = new Image();
    let img2Ready = false;
    nativeImage.src = "/image2.webp";
    nativeImage.decoding = "async";
    nativeImage.onload = () => {
      img2Ready = true;
    };

    const smoothing = Array.from({ length: B }, () => 200 + Math.random() * 60);
    let target = randomShape();
    const swapTimer = setInterval(() => {
      target = randomShape();
    }, 1000);

    const path = svg.querySelector("path");
    const pointer = { x: -RING, y: -RING };
    const smooth = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMove = (cx: number, cy: number) => {
      pointer.x = cx;
      pointer.y = cy;
    };
    const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      smooth.x += (pointer.x - smooth.x) * 0.18;
      smooth.y += (pointer.y - smooth.y) * 0.18;

      /* clear + flying symbols (background layer, visible everywhere) */
      ctx.clearRect(0, 0, w, h);
      ctx.textBaseline = "top";
      for (const p of parts) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -30) Object.assign(p, randomParticle(w, h));
        if (p.x < -80) p.x = w + 60;
        if (p.x > w + 80) p.x = -60;
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = "#2ee589";
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      /* morphing blob geometry */
      for (let i = 0; i < B; i++)
        smoothing[i] += (target.control[i] * REVEAL_RADIUS - smoothing[i]) * 0.06;
      path?.setAttribute("d", blobPath(target, REVEAL_RADIUS, t, smoothing));
      svg.style.left = `${smooth.x - RING / 2}px`;
      svg.style.top = `${smooth.y - RING / 2}px`;

      /* reveal: clip to the blob's inner circle, draw image2 */
      const cx = smooth.x;
      const cy = smooth.y;
      if (img2Ready) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, REVEAL_RADIUS * 0.95, 0, Math.PI * 2);
        ctx.clip();
        const scale = Math.max(
          (REVEAL_RADIUS * 2.4) / nativeImage.naturalWidth,
          (REVEAL_RADIUS * 2.4) / nativeImage.naturalHeight
        );
        const iw = nativeImage.naturalWidth * scale;
        const ih = nativeImage.naturalHeight * scale;
        ctx.drawImage(nativeImage, cx - iw / 2, cy - ih / 2, iw, ih);
        /* gamer field inside the circle */
        const fsize = REVEAL_RADIUS * 1.4;
        for (const s of field.stars) {
          const sx = cx - fsize / 2 + s.x * fsize;
          const sy = cy - fsize / 2 + s.y * fsize;
          ctx.globalAlpha = 0.2 + 0.4 * (0.5 + 0.5 * Math.sin(t * 2 + s.p));
          ctx.fillStyle = "#2ee589";
          ctx.beginPath();
          ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "#7dffc4";
        for (const g of field.glyphs) {
          const ang = g.angle + t * g.speed;
          const rr = g.radius * (fsize / 2 - 8);
          const gx = cx + Math.cos(ang) * rr;
          const gy = cy + Math.sin(ang) * rr * 0.6;
          ctx.font = `${g.size}px monospace`;
          ctx.fillText(g.text, gx - g.size / 2, gy - g.size / 2);
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(swapTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.codeCanvas} aria-hidden="true" />

      <figure className={styles.imageBlock}>
        <NextImage src="/image1.webp" alt="Portrait" fill sizes="100vw" style={{ objectFit: "cover" }} />
        <figcaption className={styles.image1Label}>image1 · terminal</figcaption>
      </figure>

      <svg ref={blobRef} className={styles.blob} viewBox={`0 0 ${RING} ${RING}`} aria-hidden="true">
        <path
          fill="none"
          stroke="rgba(46,229,137,0.9)"
          strokeWidth="2.5"
          style={{ filter: "drop-shadow(0 0 8px rgba(46,229,137,0.8))" }}
        />
        <path
          fill="none"
          stroke="rgba(46,229,137,0.25)"
          strokeWidth="6"
          style={{ filter: "drop-shadow(0 0 14px rgba(46,229,137,0.4))" }}
        />
      </svg>

      <figure className={styles.imageBlock2}>
        <NextImage src="/image2.webp" alt="Gamer setup" fill sizes="100vw" style={{ objectFit: "cover" }} />
        <figcaption className={styles.image2Label}>image2 · gamer</figcaption>
      </figure>
    </main>
  );
}
