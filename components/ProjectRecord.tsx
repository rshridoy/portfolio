import type { Project } from "@/content/profile";
import Topology from "./Topology";
import styles from "./ProjectRecord.module.css";

export function FeaturedRecord({ project }: { project: Project }) {
  return (
    <article className={styles.record}>
      <div>
        <div className={styles.head}>
          <h3 className={styles.title}>{project.title}</h3>
          <span className={`mono ${styles.year}`}>{project.year}</span>
        </div>
        <p className={`mono ${styles.context}`}>{project.context}</p>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.details}>
          {project.detail.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      <div className={styles.aside}>
        {project.topology ? <Topology data={project.topology} title={project.title} /> : null}
        <ul className={`mono ${styles.stack}`}>
          {project.stack.map((s) => (
            <li key={s} className={styles.chip}>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function CompactGrid({ projects }: { projects: Project[] }) {
  return (
    <div className={styles.grid}>
      {projects.map((p) => (
        <article key={p.slug} className={styles.card}>
          <div className={`mono ${styles.cardMeta}`}>
            <span>{p.context}</span>
            <span>{p.year}</span>
          </div>
          <h3 className={styles.cardTitle}>{p.title}</h3>
          <p className={styles.cardSummary}>{p.summary}</p>
          <ul className={`mono ${styles.stack}`}>
            {p.stack.map((s) => (
              <li key={s} className={styles.chip}>
                {s}
              </li>
            ))}
          </ul>
        </article>
      ))}
      {projects.length % 2 === 1 ? <div className={styles.filler} aria-hidden="true" /> : null}
    </div>
  );
}
