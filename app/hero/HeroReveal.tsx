"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { heroRevealFragment, heroRevealVertex } from "./heroRevealShader";

interface HeroRevealProps {
  baseSrc: string;
  revealSrc: string;
}

/**
 * Card-scoped Three.js canvas: base texture fills the card 1:1 (the card's
 * aspect-ratio equals the base image's natural aspect), and the reveal texture
 * is cover-fitted to the card with a mouse-following blob mask.
 */
export default function HeroReveal({ baseSrc, revealSrc }: HeroRevealProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  // base image natural aspect, measured at runtime (1.3196 ≈ 1441/1092 default)
  const [baseAspect, setBaseAspect] = useState(1441 / 1092);

  // dev alignment state (press D to toggle the panel)
  const [devOpen, setDevOpen] = useState(false);
  const [revealScale, setRevealScale] = useState({ x: 1, y: 1 });
  const [revealOffset, setRevealOffset] = useState({ x: 0, y: 0 });

  const revealScaleRef = useRef(revealScale);
  const revealOffsetRef = useRef(revealOffset);
  useEffect(() => {
    revealScaleRef.current = revealScale;
  }, [revealScale]);
  useEffect(() => {
    revealOffsetRef.current = revealOffset;
  }, [revealOffset]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    /* ---------- textures: identical settings for both layers ---------- */
    const loader = new THREE.TextureLoader();
    const texA = loader.load(baseSrc);
    const texB = loader.load(revealSrc);

    const sizeOf = (tex: THREE.Texture) => {
      const img = tex.image as
        | { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number }
        | undefined;
      return {
        w: img?.naturalWidth || img?.width || 1,
        h: img?.naturalHeight || img?.height || 1,
      };
    };

    const configTexture = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.flipY = true;
    };
    configTexture(texA);
    configTexture(texB);

    const logAspect = () => {
      const a = sizeOf(texA);
      const b = sizeOf(texB);
      if (a.w > 1 || a.h > 1) {
        setBaseAspect(a.w / a.h);
      }
      console.log(
        `[hero-reveal] base ${a.w}x${a.h} (aspect ${(a.w / a.h).toFixed(4)})`,
        `| reveal ${b.w}x${b.h} (aspect ${(b.w / b.h).toFixed(4)})`
      );
    };
    texA.onUpdate = logAspect;
    texB.onUpdate = logAspect;

    /* ---------- shader material ---------- */
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTextureA: { value: texA },
        uTextureB: { value: texB },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uImageAspect: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVelocity: { value: 0 },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uWaveAmp: { value: 0.005 },
        uRevealScale: { value: new THREE.Vector2(1, 1) },
        uRevealOffset: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: heroRevealVertex,
      fragmentShader: heroRevealFragment,
    });

    const refreshAspects = () => {
      const a = sizeOf(texA);
      const b = sizeOf(texB);
      if (a.w === 1) return; // texture not loaded yet
      const pa = material.uniforms.uImageAspect.value as THREE.Vector2;
      pa.set(a.w / a.h, b.w / b.h);
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch =
      "ontouchstart" in window && window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion) material.uniforms.uWaveAmp.value = 0;

    /* ---------- pointer + hover state (blob/tracking logic unchanged) ---------- */
    const target = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };
    let hover = 0;
    let hoverTarget = 0;
    let velocity = 0;
    const startTime = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      target.x = THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width, 0, 1);
      target.y = 1 - THREE.MathUtils.clamp((e.clientY - rect.top) / rect.height, 0, 1);
    };
    const onPointerEnter = () => {
      hoverTarget = 1;
    };
    const onPointerLeave = () => {
      hoverTarget = 0;
    };
    window.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerenter", onPointerEnter);
    mount.addEventListener("pointerleave", onPointerLeave);

    /* ---------- card-sized renderer, DPR capped at 2 ---------- */
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      renderer.getDrawingBufferSize(material.uniforms.uResolution.value as THREE.Vector2);
      refreshAspects();
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- dev shortcuts ---------- */
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") setDevOpen((v) => !v);
      if (e.key === "m" || e.key === "M") {
        // quick mask=1.0 test: force the reveal over the whole card, then restore
        const u = material.uniforms;
        const saved = u.uHover.value;
        u.uHover.value = 1;
        setTimeout(() => {
          u.uHover.value = saved;
        }, 1500);
        console.log(
          `[hero-reveal] temporary mask=1.0 (reveal fills card) for 1.5s — check it is undistorted`
        );
      }
    };
    window.addEventListener("keydown", onKey);

    /* ---------- render loop ---------- */
    let raf = 0;
    const animate = () => {
      const t = (performance.now() - startTime) / 1000;
      material.uniforms.uTime.value = t;

      if (isTouch) {
        hoverTarget = 0.6;
        target.x = 0.5 + 0.38 * Math.sin(t * 0.31);
        target.y = 0.5 + 0.3 * Math.sin(t * 0.43 + 1.7);
      }

      const prevX = mouse.x;
      const prevY = mouse.y;
      mouse.x += (target.x - mouse.x) * 0.1;
      mouse.y += (target.y - mouse.y) * 0.1;
      const step = Math.hypot(mouse.x - prevX, mouse.y - prevY);
      velocity = THREE.MathUtils.clamp((velocity + Math.min(step * 14, 1)) / 2, 0, 1);

      hover += (hoverTarget - hover) * 0.08;

      const u = material.uniforms;
      (u.uMouse.value as THREE.Vector2).set(mouse.x, mouse.y);
      u.uMouseVelocity.value = reduceMotion ? 0 : velocity;
      u.uHover.value = hover;
      (u.uRevealScale.value as THREE.Vector2).set(
        revealScaleRef.current.x,
        revealScaleRef.current.y
      );
      (u.uRevealOffset.value as THREE.Vector2).set(
        revealOffsetRef.current.x,
        revealOffsetRef.current.y
      );

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    /* ---------- cleanup ---------- */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKey);
      mount.removeEventListener("pointerenter", onPointerEnter);
      mount.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      texA.dispose();
      texB.dispose();
      renderer.dispose();
      mount.removeChild(canvas);
    };
  }, [baseSrc, revealSrc]);

  return (
    <div
      ref={mountRef}
      className="relative mx-auto block w-full"
      style={{
        aspectRatio: `${baseAspect}`,
        maxWidth: "min(100%, 1100px)",
        maxHeight: "80vh",
      }}
      aria-hidden="true"
    >
      {/* dev alignment panel — press D to toggle */}
      <div
        className={
          "absolute left-3 top-3 z-30 rounded-md bg-neutral-900/85 p-3 text-[11px] text-neutral-100 shadow-lg transition-opacity " +
          (devOpen ? "opacity-100" : "pointer-events-none opacity-0")
        }
      >
        <div className="mb-2 flex items-center justify-between gap-6">
          <span className="font-semibold">Reveal alignment</span>
          <span className="text-neutral-400">press D</span>
        </div>
        {(
          [
            {
              label: "scale.x",
              min: 0.5,
              max: 1.5,
              step: 0.005,
              v: revealScale.x,
              set: (n: number) => setRevealScale((s) => ({ ...s, x: n })),
            },
            {
              label: "scale.y",
              min: 0.5,
              max: 1.5,
              step: 0.005,
              v: revealScale.y,
              set: (n: number) => setRevealScale((s) => ({ ...s, y: n })),
            },
            {
              label: "offset.x",
              min: -0.2,
              max: 0.2,
              step: 0.001,
              v: revealOffset.x,
              set: (n: number) => setRevealOffset((o) => ({ ...o, x: n })),
            },
            {
              label: "offset.y",
              min: -0.2,
              max: 0.2,
              step: 0.001,
              v: revealOffset.y,
              set: (n: number) => setRevealOffset((o) => ({ ...o, y: n })),
            },
          ] as const
        ).map((row) => (
          <label key={row.label} className="mb-1.5 flex items-center gap-2">
            <span className="w-14 text-neutral-400">{row.label}</span>
            <input
              type="range"
              min={row.min}
              max={row.max}
              step={row.step}
              value={row.v}
              onChange={(e) => row.set(parseFloat(e.target.value))}
              className="w-40"
            />
            <span className="tabular-nums">{row.v.toFixed(3)}</span>
          </label>
        ))}
        <p className="mt-2 text-neutral-400">
          Press M to flash the reveal full-card (mask=1.0).
        </p>
        <button
          type="button"
          onClick={() =>
            console.log(
              `[hero-reveal] final uRevealScale=(${revealScale.x.toFixed(3)}, ${revealScale.y.toFixed(3)}) uRevealOffset=(${revealOffset.x.toFixed(3)}, ${revealOffset.y.toFixed(3)})`
            )
          }
          className="mt-2 rounded bg-neutral-700 px-2 py-1 text-[10px] hover:bg-neutral-600"
        >
          log final values
        </button>
      </div>
    </div>
  );
}
