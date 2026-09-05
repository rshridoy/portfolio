import styles from "./Section.module.css";

export default function Section({
  id,
  rail,
  span,
  heading,
  lede,
  children,
}: {
  id: string;
  rail: string;
  span?: string;
  heading: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <div className={styles.rail}>
          <span className={`mono ${styles.railName}`}>{rail}</span>
          <span className={styles.railMark} />
          {span ? <span className="mono">{span}</span> : null}
        </div>
        <div className={styles.body}>
          <h2 id={`${id}-heading`} className={styles.heading}>
            {heading}
          </h2>
          {lede ? <p className={styles.lede}>{lede}</p> : null}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </section>
  );
}
