export const POSES = {
  idle: "/chibi/idle-open.png",
  blink: "/chibi/idle-blink.png",
  wave: "/chibi/hero-wave.png",
  celebrate: "/chibi/success-celebrate.png",
  think: "/chibi/thinking.png",
  laptop: "/chibi/skills-laptop.png",
  present: "/chibi/projects-presenting.png",
  walk: "/chibi/experience-walking.png",
  handsHips: "/chibi/about-hands-hips.png",
  phone: "/chibi/contact-phone.png",
  shrug: "/chibi/error-shrug.png",
  gaming: "/chibi/gaming-controller.png",
} as const;

export type PoseKey = keyof typeof POSES;
