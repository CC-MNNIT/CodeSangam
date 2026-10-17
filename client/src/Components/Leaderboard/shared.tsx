import { CSSProperties, ReactNode } from "react";
import RankSigil, { SIGIL_GLOW } from "../../ui/art/RankSigil";
import SlingRing from "../../ui/art/SlingRing";

/** Gold / silver / bronze as "r g b", indexed by rank 1–3. */
export const MEDAL_TINT = {
  1: SIGIL_GLOW[1],
  2: SIGIL_GLOW[2],
  3: SIGIL_GLOW[3],
} as const;

export const tintStyle = (tint: string) => ({ ["--tint" as string]: tint } as CSSProperties);

/** A rank in the table: a sigil for the podium, a numeral for everyone else. */
export function RankCell({ rank }: { rank: number }) {
  if (rank >= 1 && rank <= 3) {
    return <RankSigil rank={rank as 1 | 2 | 3} className="mx-auto h-9 w-9" />;
  }
  return (
    <span className="mx-auto inline-grid h-9 min-w-[2.25rem] place-items-center font-display text-sm font-semibold text-bone-300">
      {rank}
    </span>
  );
}

interface Column {
  label: string;
  /** Centre-aligned numeric/ID columns look better right under their header. */
  className?: string;
}

interface TableProps {
  columns: Column[];
  rows: ReactNode[][];
}

/**
 * The full standings. Top three rows are lit in their medal colour; the header
 * stays under the fixed navigation while the list scrolls.
 */
export function GrimoireTable({ columns, rows }: TableProps) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-3 pb-28 pt-6 sm:px-6">
      <div className="overflow-clip rounded-3xl bg-void-900/70 ring-1 ring-white/10 shadow-slab">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.label}
                  scope="col"
                  className={`sticky top-[8.25rem] z-10 bg-void-800/95 px-3 py-4 text-center font-display text-[0.68rem] font-semibold uppercase tracking-rune text-bone-300 backdrop-blur-md sm:px-6 md:top-[9.25rem] ${
                    c.className ?? ""
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, i) => {
              const podium = i < 3;
              return (
                <tr
                  key={i}
                  style={{
                    ...(podium ? tintStyle(MEDAL_TINT[(i + 1) as 1 | 2 | 3]) : {}),
                    animationDelay: `${Math.min(i, 14) * 45}ms`,
                  }}
                  className={`border-t border-white/[0.06] transition-colors duration-300 motion-safe:animate-rise hover:bg-white/[0.045] ${
                    podium ? "bg-tint/[0.07]" : ""
                  }`}
                >
                  {cells.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-3 py-3 text-center sm:px-6 ${
                        j === 0 ? "w-20" : j === 1 ? "font-medium text-bone-50" : "text-bone-200"
                      } ${j > 1 ? "tabular-nums" : ""} break-words`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Shown until results are published. A portal that has not opened yet. */
export function NotOutYet({ label = "RESULTS ARE NOT OUT YET" }: { label?: string }) {
  return (
    <main className="relative grid min-h-[100svh] place-items-center px-6 pt-24">
      <div className="flex flex-col items-center gap-10">
        <div className="relative w-[min(70vw,22rem)]">
          <SlingRing className="w-full opacity-70" />
          <div
            aria-hidden="true"
            className="absolute inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--tint)/0.32),transparent)] motion-safe:animate-breathe"
          />
        </div>
        <h1 className="rounded-full px-8 py-4 text-center font-display text-[clamp(0.85rem,2.4vw,1.1rem)] font-semibold uppercase tracking-rune text-bone-50 ring-1 ring-tint/60 shadow-portal">
          {label}
        </h1>
      </div>
    </main>
  );
}

/** "Scroll down to see complete Leaderboard" with a spark running down a line. */
export function ScrollHint() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-4 text-center">
      <h2 className="px-6 font-display text-[0.7rem] font-semibold uppercase tracking-rune text-bone-300">
        Scroll down to see complete Leaderboard
      </h2>
      <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-white/10">
        <span className="absolute inset-0 bg-gradient-to-b from-sling-300 to-sling-500 motion-safe:animate-line-down" />
      </span>
    </div>
  );
}

/** The plinth under a podium column. */
export function Plinth({
  rank,
  className = "",
  size = "sm",
  children,
}: {
  rank: 1 | 2 | 3;
  className?: string;
  size?: "sm" | "lg";
  children?: ReactNode;
}) {
  const HEIGHT = {
    sm: { 1: "h-36 md:h-44", 2: "h-28 md:h-32", 3: "h-24" },
    lg: { 1: "h-44 md:h-52", 2: "h-40 md:h-44", 3: "h-36 md:h-40" },
  } as const;
  const h = HEIGHT[size][rank];
  return (
    <div
      style={tintStyle(MEDAL_TINT[rank])}
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-t-[1.75rem] ${h} bg-gradient-to-b from-tint/[0.16] to-void-900/10 ring-1 ring-tint/50 shadow-portal ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-tint to-transparent"
      />
      {children}
    </div>
  );
}
