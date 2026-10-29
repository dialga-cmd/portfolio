import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Aditya Raj | Full-Stack Engineer & Open Source Maintainer",
  description:
    "Self-taught full-stack engineer, IIT Madras B.S. student, and open-source maintainer building across cryptography, developer tooling, AI systems, and web.",
  openGraph: {
    title: "Aditya Raj | Full-Stack Engineer & Open Source Maintainer",
    description:
      "Self-taught full-stack engineer, IIT Madras B.S. student, and open-source maintainer building across cryptography, developer tooling, AI systems, and web.",
    url: "https://worldaditya.dev",
    siteName: "Aditya Raj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Raj | Full-Stack Engineer & Open Source Maintainer",
    description:
      "Self-taught full-stack engineer, IIT Madras B.S. student, and open-source maintainer building across cryptography, developer tooling, AI systems, and web.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${monoFont.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
