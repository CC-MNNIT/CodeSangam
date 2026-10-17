import { useId } from "react";

interface Props {
  rank: 1 | 2 | 3;
  className?: string;
}

const METAL = {
  1: { a: "#ffe9b8", b: "#ffb347", c: "#a84d05", glow: "255 179 71" },
  2: { a: "#f1f3ff", b: "#aab2d1", c: "#5d6585", glow: "170 178 209" },
  3: { a: "#ffd2ad", b: "#d98a4a", c: "#7a3e14", glow: "217 138 74" },
} as const;

/**
 * Rank sigils for the leaderboard: a faceted medal with one, two or three
 * strokes (the numeral drawn as marks), and a crown on the champion.
 */
export default function RankSigil({ rank, className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const m = METAL[rank];
  const marks = Array.from({ length: rank }, (_, i) => (i - (rank - 1) / 2) * 9);

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={`Rank ${rank}`}
    >
      <defs>
        <linearGradient id={`${uid}-m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={m.a} />
          <stop offset="0.5" stopColor={m.b} />
          <stop offset="1" stopColor={m.c} />
        </linearGradient>
      </defs>
      {rank === 1 && (
        <path
          d="M18 14l5.5 6L32 8l8.5 12L46 14l-2.4 11H20.4z"
          fill={`url(#${uid}-m)`}
          stroke={m.a}
          strokeWidth="1"
        />
      )}
      <path
        d="M32 24L51 38 32 58 13 38z"
        fill="#0a0612"
        stroke={`url(#${uid}-m)`}
        strokeWidth="3"
      />
      <path d="M32 29L45 38 32 52 19 38z" stroke={m.b} strokeOpacity="0.45" strokeWidth="1" />
      {marks.map((x) => (
        <path key={x} d={`M${32 + x} 33.5v9`} stroke={m.a} strokeWidth="2.6" />
      ))}
    </svg>
  );
}

export const SIGIL_GLOW: Record<1 | 2 | 3, string> = {
  1: METAL[1].glow,
  2: METAL[2].glow,
  3: METAL[3].glow,
};
