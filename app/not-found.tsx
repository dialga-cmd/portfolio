"use client";

import Link from "next/link";
import SectionPose from "./components/SectionPose";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#050d0a] text-emerald-100">
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <SectionPose name="error" />
        <p className="font-mono text-sm uppercase tracking-[0.4em] text-emerald-400/70">404</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Page not found</h1>
        <Link href="/" className="rounded-full border border-emerald-400/70 px-6 py-2.5 text-sm transition hover:bg-emerald-400/10">
          Go home
        </Link>
      </div>
    </main>
  );
}
