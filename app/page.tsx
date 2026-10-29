import { Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import OpenSource from "./components/OpenSource";
import Projects from "./components/Projects";
import Achievements from "./components/Achievements";
import Gaming from "./components/Gaming";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#050d0a] text-neutral-100">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 10%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 10%, black 20%, transparent 80%)",
        }}
      />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <OpenSource />
      <Projects />
      <Achievements />
      <Suspense fallback={null}>
        <Gaming />
      </Suspense>
      <Contact />
    </main>
  );
}
