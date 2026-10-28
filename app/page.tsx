"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const MESSAGES = [
  "Portfolio is being built right now",
  "Compiling projects...",
  "Rendering components...",
  "Deploying content...",
  "Almost there...",
];

export default function Home() {
  const [lines, setLines] = useState<string[]>(["> booting portfolio..."]);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setLines((prev) => [...prev.slice(-5), MESSAGES[i % MESSAGES.length]]);
    }, 1400);

    const blinkTimer = setInterval(
      () => setBlink((b) => !b),
      530
    );

    return () => {
      clearInterval(timer);
      clearInterval(blinkTimer);
    };
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.scanline} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <section className={styles.terminal}>
        <header className={styles.titlebar}>
          <span className={styles.dot} data-color="red" />
          <span className={styles.dot} data-color="yellow" />
          <span className={styles.dot} data-color="green" />
          <span className={styles.title}>~/portfolio — zsh</span>
        </header>

        <div className={styles.body}>
          {lines.map((line, idx) => (
            <p key={idx} className={idx === lines.length - 1 ? styles.lineActive : styles.line}>
              <span className={styles.prompt}>~ $</span> {line}
            </p>
          ))}
          <p className={styles.cursorLine} aria-hidden={!blink}>
            <span className={styles.prompt}>~ $</span>{" "}
            <span className={styles.cursor} />
          </p>
        </div>
      </section>

      <h1 className={styles.heading}>
        Portfolio is being built right now
        <span className={styles.headingCursor} aria-hidden="true" />
      </h1>
    </main>
  );
}
