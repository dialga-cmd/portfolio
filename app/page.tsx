"use client";

import dynamic from "next/dynamic";

// The Three.js canvas touches WebGL at mount — load it client-side only.
const HeroCanvas = dynamic(() => import("./hero/HeroReveal"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0b0f0d] text-neutral-200">
      {/* faint grid behind the card — plain CSS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(46,229,137,0.05) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(46,229,137,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <HeroCanvas baseSrc="/hero-base.png" revealSrc="/hero-reveal.png" />
      </div>
    </main>
  );
}
