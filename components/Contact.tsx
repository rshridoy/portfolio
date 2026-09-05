"use client";

import Image from "next/image";
import { useState } from "react";
import { profile } from "@/content/profile";
import styles from "./Contact.module.css";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // The site is a static export with no server to post to, so the form hands a
  // fully composed message to the sender's own mail client.
  const compose = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const from = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? "");
    const message = String(data.get("message") ?? "");
    const body = `${message}\n\n— ${name}\n${from}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.details}>
        <Image
          className={styles.portrait}
          src="/images/dp.jpg"
          alt={profile.name}
          width={132}
          height={132}
          sizes="132px"
        />

        <div className={styles.row}>
          <span className={`mono ${styles.rowLabel}`}>Email</span>
          <span className={styles.rowValue}>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </span>
        </div>
        <button
          type="button"
          onClick={copyEmail}
          className={`mono ${styles.copy} ${copied ? styles.copied : ""}`}
        >
          {copied ? "Copied" : "Copy email address"}
        </button>

        <div className={styles.row}>
          <span className={`mono ${styles.rowLabel}`}>Phone</span>
          <span className={styles.rowValue}>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
          </span>
        </div>

        <div className={styles.row}>
          <span className={`mono ${styles.rowLabel}`}>Based in</span>
          <span className={styles.rowValue}>{profile.location}</span>
        </div>

        <div className={`mono ${styles.socials}`}>
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>

      <form className={styles.form} onSubmit={compose}>
        <div className={styles.pair}>
          <div className={styles.field}>
            <label className={`mono ${styles.label}`} htmlFor="name">
              Your name
            </label>
            <input className={styles.input} id="name" name="name" type="text" required />
          </div>
          <div className={styles.field}>
            <label className={`mono ${styles.label}`} htmlFor="email">
              Your email
            </label>
            <input className={styles.input} id="email" name="email" type="email" required />
          </div>
        </div>

        <div className={styles.field}>
          <label className={`mono ${styles.label}`} htmlFor="subject">
            Subject
          </label>
          <input className={styles.input} id="subject" name="subject" type="text" required />
        </div>

        <div className={styles.field}>
          <label className={`mono ${styles.label}`} htmlFor="message">
            Message
          </label>
          <textarea className={styles.textarea} id="message" name="message" rows={6} required />
        </div>

        <button type="submit" className={styles.submit}>
          Open in your mail app
        </button>
        <p className={`mono ${styles.note}`}>
          This fills in a message and hands it to your mail client, so you keep a copy of what you sent.
        </p>
      </form>
    </div>
  );
}
