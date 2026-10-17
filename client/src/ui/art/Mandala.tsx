import { useMemo } from "react";
import { seeded } from "../../lib/seeded";

interface Props {
  className?: string;
  /** Stroke colour of every layer (any CSS colour, defaults to currentColor). */
  color?: string;
  /** Animate the layers (counter-rotating). Off for static renders. */
  spin?: boolean;
}

const C = 400; // viewBox centre
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};
const poly = (r: number, n: number, rot = 0) =>
  Array.from({ length: n }, (_, i) => polar(r, rot + (360 / n) * i).join(",")).join(" ");

/** A small invented rune: one stem, a few branches and sometimes a dot. */
function runePath(rand: () => number) {
  const branches = [
    "M0 -5 L5 -9",
    "M0 -5 L-5 -9",
    "M0 1 L5 -3",
    "M0 1 L-5 -3",
    "M0 5 L5 9",
    "M0 5 L-5 9",
    "M-5 -1 L5 -1",
    "M-4 9 L4 9",
  ];
  let d = "M0 -9 L0 9";
  const count = 1 + Math.floor(rand() * 3);
  for (let i = 0; i < count; i++) d += " " + branches[Math.floor(rand() * branches.length)];
  if (rand() > 0.6) d += " M-1.6 -12 h3.2";
  return d;
}

/**
 * The Sanctum's rotating shield: runic band, hexagram, eight-point star,
 * petals. Four stacked <svg> layers rotate at different speeds — rotating the
 * element (not the SVG children) keeps every layer on the GPU compositor.
 */
export default function Mandala({ className = "", color = "currentColor", spin = true }: Props) {
  const runes = useMemo(() => {
    const rand = seeded(2022);
    const n = 56;
    return Array.from({ length: n }, (_, i) => {
      const deg = (360 / n) * i;
      const [x, y] = polar(350, deg);
      return { d: runePath(rand), x, y, deg };
    });
  }, []);

  const common = {
    viewBox: "0 0 800 800",
    fill: "none",
    stroke: color,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    className: "absolute inset-0 h-full w-full will-parallax",
  };
  const rot = (speed: string) => (spin ? `${speed} motion-reduce:animate-none` : "");

  return (
    <div className={`${/(absolute|fixed)/.test(className) ? "" : "relative"} aspect-square ${className}`} aria-hidden="true">
      {/* Outer frame + runic band (slow, clockwise) */}
      <svg {...common} className={`${common.className} ${rot("animate-spin-slow")}`}>
        <circle cx={C} cy={C} r="394" strokeWidth="1.4" />
        <circle cx={C} cy={C} r="384" strokeWidth="0.8" strokeDasharray="1 7" />
        <circle cx={C} cy={C} r="372" strokeWidth="1.2" />
        <circle cx={C} cy={C} r="326" strokeWidth="1.2" />
        {runes.map((r, i) => (
          <path
            key={i}
            d={r.d}
            strokeWidth="1.5"
            transform={`translate(${r.x.toFixed(2)} ${r.y.toFixed(2)}) rotate(${r.deg.toFixed(2)}) scale(1.05)`}
          />
        ))}
      </svg>

      {/* Hexagram + ring of notches (counter-clockwise) */}
      <svg {...common} className={`${common.className} ${rot("animate-spin-rev")}`}>
        <polygon points={poly(300, 3)} strokeWidth="1.3" />
        <polygon points={poly(300, 3, 180)} strokeWidth="1.3" />
        <circle cx={C} cy={C} r="300" strokeWidth="0.9" />
        <circle cx={C} cy={C} r="286" strokeWidth="0.8" strokeDasharray="3 5" />
        {Array.from({ length: 36 }, (_, i) => {
          const [x1, y1] = polar(300, i * 10);
          const [x2, y2] = polar(i % 3 === 0 ? 316 : 308, i * 10);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.2" />;
        })}
      </svg>

      {/* Eight-point star + petals (clockwise, medium) */}
      <svg {...common} className={`${common.className} ${rot("animate-spin-medium")}`}>
        <polygon points={poly(238, 4)} strokeWidth="1.2" />
        <polygon points={poly(238, 4, 45)} strokeWidth="1.2" />
        <circle cx={C} cy={C} r="238" strokeWidth="1" />
        <circle cx={C} cy={C} r="196" strokeWidth="1.4" />
        {Array.from({ length: 12 }, (_, i) => {
          const [x, y] = polar(150, i * 30);
          return <circle key={i} cx={x} cy={y} r="48" strokeWidth="0.9" />;
        })}
      </svg>

      {/* Core (counter-clockwise, fast) */}
      <svg {...common} className={`${common.className} ${rot("animate-spin-rev-fast")}`}>
        <circle cx={C} cy={C} r="96" strokeWidth="1.4" />
        <circle cx={C} cy={C} r="84" strokeWidth="0.8" strokeDasharray="2 6" />
        <polygon points={poly(70, 6)} strokeWidth="1.3" />
        <polygon points={poly(70, 6, 30)} strokeWidth="1.3" />
        <circle cx={C} cy={C} r="22" strokeWidth="1.6" />
        <circle cx={C} cy={C} r="5" fill={color} stroke="none" />
      </svg>
    </div>
  );
}
