import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Contact from "@/components/Contact";
import { FeaturedRecord, CompactGrid } from "@/components/ProjectRecord";
import {
  activities,
  awards,
  education,
  experience,
  featured,
  profile,
  projects,
  publications,
  skills,
  thesis,
} from "@/content/profile";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />

      <main id="main">
        <Section
          id="work"
          rail="Systems"
          span="2025 — 2026"
          heading="Three systems, running"
          lede="Each of these went to production. The interesting part of all three is the same: what happens between the services when a request is in flight."
        >
          {featured.map((project) => (
            <FeaturedRecord key={project.slug} project={project} />
          ))}
        </Section>

        <Section
          id="projects"
          rail="Earlier work"
          span="2023 — 2025"
          heading="Models and smaller builds"
          lede="Research models and applications, mostly around language — several in Bangla, where good pretrained models are scarce."
        >
          <CompactGrid projects={projects} />
        </Section>

        <Section id="skills" rail="Toolkit" heading="What I work with">
          <div className={styles.skillGroups}>
            {skills.map((group) => (
              <div key={group.group} className={styles.skillGroup}>
                <h3>{group.group}</h3>
                <ul className={`mono ${styles.skillList}`}>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" rail="Track record" span="2024 — now" heading="Where I have worked">
          <div className={styles.timeline}>
            {experience.map((job) => (
              <article key={job.org + job.period} className={styles.entry}>
                <div className={styles.entryHead}>
                  <h3 className={styles.entryRole}>{job.role}</h3>
                  <span className={`mono ${styles.entryPeriod}`}>{job.period}</span>
                </div>
                <p className={`mono ${styles.entryOrg}`}>{job.org}</p>
                <ul className={styles.points}>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <h3 className={styles.subhead}>Education</h3>
          <div className={styles.schools}>
            {education.map((school) => (
              <div key={school.school} className={styles.school}>
                <span className={styles.schoolName}>{school.school}</span>
                <span className={`mono ${styles.schoolPeriod}`}>{school.period}</span>
                <span className={styles.schoolAward}>
                  {school.award}, {school.place}
                </span>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>Awards</h3>
          <div className={styles.awards}>
            {awards.map((award) => (
              <div key={award.title} className={styles.award}>
                <span className={`mono ${styles.awardDate}`}>{award.date}</span>
                <h4 className={styles.awardTitle}>{award.title}</h4>
                <p className={styles.awardBody}>{award.body}</p>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>Outside the desk</h3>
          <div className={styles.activities}>
            {activities.map((activity) => (
              <div key={activity.role + activity.period} className={styles.activity}>
                <span className={styles.activityRole}>{activity.role}</span>
                <span className={styles.activityOrg}>{activity.org}</span>
                <span className={`mono ${styles.activityPeriod}`}>{activity.period}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="research"
          rail="Research"
          span="2023 — 2024"
          heading="Published work"
          lede="Computer vision for crop disease, and benchmark datasets for Bangla — including regional dialects that most translation systems do not cover."
        >
          <div className={styles.papers}>
            {publications.map((paper) => (
              <article key={paper.title} className={styles.paper}>
                <h3 className={styles.paperTitle}>{paper.title}</h3>
                <p className={styles.paperAuthors}>{paper.authors}</p>
                <p className={`mono ${styles.paperVenue}`}>{paper.venue}</p>
                <p className={`mono ${styles.paperNote}`}>{paper.note}</p>
                <a
                  className={styles.paperLink}
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {paper.linkLabel}
                </a>
              </article>
            ))}
          </div>

          <h3 className={styles.subhead}>Undergraduate thesis</h3>
          <div className={styles.thesis}>
            <p className={styles.thesisTitle}>{thesis.title}</p>
            <p className={`mono ${styles.thesisMeta}`}>Supervised by {thesis.supervisor}</p>
            <p className={`mono ${styles.thesisMeta}`}>Co-supervised by {thesis.cosupervisor}</p>
          </div>
        </Section>

        <Section
          id="contact"
          rail="Contact"
          heading="Start a conversation"
          lede="Open to engineering roles and to build work on pipelines, agents, and backend systems. I read everything that arrives."
        >
          <Contact />
        </Section>
      </main>

      <footer className={styles.footer}>
        <div className={`mono ${styles.footerInner}`}>
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>
            Built with Next.js and three.js —{" "}
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
              source on GitHub
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}
