import { useMemo } from "react";
import { seeded } from "../../lib/seeded";

interface Props {
  className?: string;
  /** Crack colour as "r g b" (the glow). Core lines are always near-white. */
  tint?: string;
  seed?: number;
}

const W = 1600;
const H = 1000;

/** A jagged line from (x1,y1) to (x2,y2) built from random offsets. */
function jagged(
  rand: () => number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  steps: number,
  jitter: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  let d = `M${x1.toFixed(1)} ${y1.toFixed(1)}`;
  const pts: [number, number][] = [[x1, y1]];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const off = i === steps ? 0 : (rand() - 0.5) * 2 * jitter;
    const x = x1 + dx * t + nx * off;
    const y = y1 + dy * t + ny * off;
    pts.push([x, y]);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return { d, pts };
}

/**
 * A fracture in the fabric of the page. Every path is drawn with
 * `pathLength=1`, so a scroll timeline can reveal them by animating
 * `strokeDashoffset` from 1 to 0 on `.crack`.
 */
export default function Fracture({ className = "", tint = "255 143 31", seed = 4242 }: Props) {
  const paths = useMemo(() => {
    const rand = seeded(seed);
    const cx = W / 2;
    const cy = H / 2;
    const out: { d: string; w: number; key: string }[] = [];
    const rays = 11;
    for (let i = 0; i < rays; i++) {
      const base = (Math.PI * 2 * i) / rays + (rand() - 0.5) * 0.35;
      const reach = 620 + rand() * 520;
      const x2 = cx + Math.cos(base) * reach * 1.25;
      const y2 = cy + Math.sin(base) * reach * 0.9;
      const main = jagged(rand, cx, cy, x2, y2, 9 + Math.floor(rand() * 4), 34);
      out.push({ d: main.d, w: 1, key: `m${i}` });
      // Branches split off the main crack part-way along it.
      const branchCount = 2 + Math.floor(rand() * 2);
      for (let b = 0; b < branchCount; b++) {
        const from = main.pts[2 + Math.floor(rand() * (main.pts.length - 4))];
        const ang = base + (rand() > 0.5 ? 1 : -1) * (0.45 + rand() * 0.7);
        const blen = 120 + rand() * 260;
        const br = jagged(
          rand,
          from[0],
          from[1],
          from[0] + Math.cos(ang) * blen,
          from[1] + Math.sin(ang) * blen,
          4 + Math.floor(rand() * 3),
          18
        );
        out.push({ d: br.d, w: 0.6, key: `b${i}-${b}` });
      }
    }
    return out;
  }, [seed]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Soft coloured bloom under the crack */}
      <g stroke={`rgb(${tint})`} strokeOpacity="0.38">
        {paths.map((p) => (
          <path key={`g${p.key}`} className="crack crack-glow" d={p.d} pathLength={1} strokeDasharray="1" strokeWidth={9 * p.w} />
        ))}
      </g>
      {/* Hot core */}
      <g stroke="#fff" strokeOpacity="0.95">
        {paths.map((p) => (
          <path key={`c${p.key}`} className="crack crack-core" d={p.d} pathLength={1} strokeDasharray="1" strokeWidth={2.2 * p.w} />
        ))}
      </g>
    </svg>
  );
}
