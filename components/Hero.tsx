"use client";

import dynamic from "next/dynamic";
import { profile } from "@/content/profile";
import styles from "./Hero.module.css";

// three.js only runs in the browser, and it should never block first paint of
// the headline — the hero reads correctly with the canvas empty.
const HeroGraph = dynamic(() => import("./HeroGraph"), { ssr: false });

export default function Hero() {
  return (
    <div id="top" className={styles.hero}>
      <div className={styles.canvas}>
        <HeroGraph />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.rail}>
          <span className="mono">2026</span>
          <span className={styles.railMark} />
          <span className={`mono ${styles.caption}`}>
            services, edges, and the data moving between them
          </span>
        </div>

        <div>
          <p className={`mono ${styles.status}`}>
            <span className={styles.statusDot} aria-hidden="true" />
            Software engineer at Qtec Solution, Dhaka
          </p>

          <h1 className={styles.headline}>
            {profile.headline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>

          <p className={styles.dek}>{profile.dek}</p>

          <div className={styles.actions}>
            <a className={styles.primary} href="#contact">
              Get in touch
            </a>
            <a className={styles.secondary} href={profile.cv} target="_blank" rel="noopener noreferrer">
              Download CV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
