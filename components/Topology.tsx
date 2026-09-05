import type { Topology as TopologyData } from "@/content/profile";
import styles from "./Topology.module.css";

/**
 * The project's architecture drawn to scale from its real service list — a
 * signature, not an ornament. Hidden from screen readers because the same
 * structure is described in the surrounding prose.
 */
export default function Topology({ data, title }: { data: TopologyData; title: string }) {
  const at = (id: string) => data.nodes.find((n) => n.id === id)!;

  return (
    <figure className={styles.figure}>
      <svg viewBox={data.viewBox} className={styles.svg} role="img" aria-label={`${title} architecture`}>
        {data.edges.map(([a, b]) => {
          const p = at(a);
          const q = at(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke="var(--rule)"
              strokeWidth="0.7"
            />
          );
        })}
        {data.nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="2.8" fill="var(--ground)" stroke="var(--muted)" strokeWidth="0.8" />
            {n.label ? (
              <text
                x={n.x}
                y={n.above ? n.y - 5.5 : n.y + 9}
                textAnchor="middle"
                className={styles.label}
              >
                {n.label}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </figure>
  );
}
