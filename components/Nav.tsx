"use client";

import { useEffect, useState } from "react";
import styles from "./Nav.module.css";

const items = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (window.scrollY < 200) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Mark the section nearest the top of the reading area.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        // While the hero still fills the screen, no section is the current one.
        if (window.scrollY < 200) setActive("");
        else if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`${styles.bar} ${scrolled ? styles.barScrolled : ""}`}>
      <nav className={styles.inner} aria-label="Sections">
        <a href="#top" className={styles.mark}>
          <span className={styles.markDot} aria-hidden="true" />
          Md. Rabius Sani
        </a>

        <button
          type="button"
          className={`${styles.toggle} ${open ? styles.toggleOpen : ""}`}
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.toggleBars} aria-hidden="true" />
        </button>

        <ul id="nav-links" className={`${styles.links} ${open ? styles.linksOpen : ""}`}>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${styles.link} ${active === item.id ? styles.linkActive : ""}`}
                aria-current={active === item.id ? "true" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
