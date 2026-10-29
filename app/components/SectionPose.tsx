"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const POSE_MAP: Record<string, string> = {
  hero: "/chibi/hero-wave.png",
  about: "/chibi/about-hands-hips.png",
  skills: "/chibi/skills-laptop.png",
  opensource: "/chibi/thinking.png",
  projects: "/chibi/projects-presenting.png",
  achievements: "/chibi/success-celebrate.png",
  contact: "/chibi/contact-phone.png",
  error: "/chibi/error-shrug.png",
};

interface SectionPoseProps {
  name: string;
  className?: string;
}

export default function SectionPose({ name, className = "" }: SectionPoseProps) {
  const src = POSE_MAP[name];

  return (
    <motion.div
      className={`relative h-[280px] w-[240px] sm:h-[340px] sm:w-[280px] lg:h-[380px] lg:w-[320px] ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {src ? (
          <Image
            src={src}
            alt={`Chibi pose for ${name}`}
            fill
            sizes="(max-width: 640px) 70vw, 320px"
            style={{ objectFit: "contain" }}
            draggable={false}
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </motion.div>
      <div className="absolute -bottom-4 left-1/2 h-3 w-28 -translate-x-1/2 rounded-[50%] bg-emerald-400/15 sm:w-36" />
    </motion.div>
  );
}
