import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className={styles.wrap}>
      <p className={`mono ${styles.code}`}>404</p>
      <h1 className={styles.heading}>That page is not here</h1>
      <p className={styles.body}>
        The link may be out of date, or the page may have moved. The homepage has everything.
      </p>
      <Link className={styles.action} href="/">
        Go to the homepage
      </Link>
    </main>
  );
}
