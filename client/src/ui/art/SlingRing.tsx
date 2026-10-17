import { useId, useMemo } from "react";
import { seeded } from "../../lib/seeded";

interface Props {
  className?: string;
  /** Spark colour as "r g b". Defaults to the sling-ring gold. */
  tint?: string;
  /** Rotate the layers. */
  spin?: boolean;
  /** Cut a gap into the ring (used by the 404 "broken portal"). */
  broken?: boolean;
}

const C = 300;
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};
const arc = (r: number, from: number, to: number) => {
  const [x1, y1] = polar(r, from);
  const [x2, y2] = polar(r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
};

/**
 * The sling ring: a circle of orbiting orange sparks, drawn as stacked <svg>
 * layers (each rotated on the compositor) over a cheap radial halo. No SVG
 * filters — those would repaint every frame.
 */
export default function SlingRing({
  className = "",
  tint = "255 143 31",
  spin = true,
  broken = false,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const rgb = (a = 1) => `rgb(${tint} / ${a})`;

  const sparks = useMemo(() => {
    const rand = seeded(77);
    return Array.from({ length: 34 }, (_, i) => {
      const deg = rand() * 360;
      const r = 252 + rand() * 62;
      const [x, y] = polar(r, deg);
      return { x, y, s: 1 + rand() * 2.6, o: 0.4 + rand() * 0.6, key: i };
    });
  }, []);

  const base = {
    viewBox: "0 0 600 600",
    fill: "none",
    "aria-hidden": true,
    focusable: false,
    className: "absolute inset-0 h-full w-full will-parallax",
  } as const;
  const rot = (speed: string) => (spin ? `${speed} motion-reduce:animate-none` : "");
  const gap = broken ? [[14, 118], [150, 215], [250, 350]] : [[0, 359.9]];

  return (
    <div className={`${/(absolute|fixed)/.test(className) ? "" : "relative"} aspect-square ${className}`} aria-hidden="true">
      {/* Halo */}
      <div
        className="absolute inset-[-12%] rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${rgb(0)} 52%, ${rgb(0.22)} 70%, ${rgb(0.07)} 86%, transparent 100%)`,
        }}
      />

      {/* Layer 1 — outer sparkling circle (slow) */}
      <svg {...base} className={`${base.className} ${rot("animate-spin-slow")}`}>
        <defs>
          <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={rgb(1)} />
            <stop offset="0.55" stopColor={rgb(0.35)} />
            <stop offset="1" stopColor={rgb(1)} />
          </linearGradient>
        </defs>
        {gap.map(([a, b], i) => (
          <path key={i} d={arc(286, a, b)} stroke={`url(#${uid}-a)`} strokeWidth="2.4" strokeLinecap="round" />
        ))}
        <circle cx={C} cy={C} r="272" stroke={rgb(0.9)} strokeWidth="5" strokeLinecap="round" strokeDasharray="1.5 11" />
        <circle cx={C} cy={C} r="262" stroke={rgb(0.5)} strokeWidth="1" />
      </svg>

      {/* Layer 2 — thick comet arcs (counter-clockwise) */}
      <svg {...base} className={`${base.className} ${rot("animate-spin-rev")}`}>
        <path d={arc(238, 0, 78)} stroke={rgb(0.95)} strokeWidth="7" strokeLinecap="round" />
        <path d={arc(238, 86, 104)} stroke={rgb(0.6)} strokeWidth="7" strokeLinecap="round" />
        <path d={arc(238, 180, 246)} stroke={rgb(0.95)} strokeWidth="7" strokeLinecap="round" />
        <path d={arc(238, 254, 270)} stroke={rgb(0.6)} strokeWidth="7" strokeLinecap="round" />
        <path d={arc(220, 40, 120)} stroke={rgb(0.5)} strokeWidth="2" strokeLinecap="round" />
        <path d={arc(220, 220, 300)} stroke={rgb(0.5)} strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Layer 3 — tick ring + inner circles (clockwise) */}
      <svg {...base} className={`${base.className} ${rot("animate-spin-medium")}`}>
        <circle cx={C} cy={C} r="200" stroke={rgb(0.55)} strokeWidth="1.2" />
        <circle cx={C} cy={C} r="188" stroke={rgb(0.3)} strokeWidth="1" strokeDasharray="2 6" />
        {Array.from({ length: 72 }, (_, i) => {
          const [x1, y1] = polar(204, i * 5);
          const [x2, y2] = polar(i % 6 === 0 ? 222 : 212, i * 5);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={rgb(i % 6 === 0 ? 0.9 : 0.45)} strokeWidth="1.4" strokeLinecap="round" />;
        })}
      </svg>

      {/* Layer 4 — loose sparks that flicker around the rim */}
      <svg {...base} className={`${base.className} ${rot("animate-spin-fast")}`}>
        {sparks.map((s) => (
          <circle
            key={s.key}
            cx={s.x}
            cy={s.y}
            r={s.s}
            fill={rgb(s.o)}
          />
        ))}
      </svg>
    </div>
  );
}
