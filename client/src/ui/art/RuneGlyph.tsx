import { GlyphKind } from "../../lib/events";

interface Props {
  kind: GlyphKind;
  className?: string;
  title?: string;
}

/**
 * One line-drawn pictogram per event (web, Android, ML, Java),
 * authored on a 64×64 grid with a single stroke weight so they read as a set.
 * Colour comes from `currentColor`.
 */
export default function RuneGlyph({ kind, className = "", title }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {kind === "web" && (
        <>
          <circle cx="32" cy="32" r="22" />
          <ellipse cx="32" cy="32" rx="9.5" ry="22" />
          <path d="M10.5 32h43" />
          <path d="M14 21.5q18 6 36 0" />
          <path d="M14 42.5q18-6 36 0" />
        </>
      )}
      {kind === "android" && (
        <>
          <path d="M17 31a15 15 0 0 1 30 0z" />
          <circle cx="26" cy="24.5" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="38" cy="24.5" r="1.4" fill="currentColor" stroke="none" />
          <path d="M23 13l-3-5M41 13l3-5" />
          <path d="M17 35h30v11a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3z" />
          <path d="M11.5 36v9M52.5 36v9" strokeWidth="4.5" />
          <path d="M26 49v7M38 49v7" strokeWidth="4.5" />
        </>
      )}
      {kind === "ml" && (
        <>
          <path d="M12 18L32 12M12 18L32 26M12 18L32 40M12 32L32 12M12 32L32 26M12 32L32 40M12 32L32 52M12 46L32 26M12 46L32 40M12 46L32 52" opacity="0.55" strokeWidth="1.4" />
          <path d="M32 12L52 24M32 26L52 24M32 26L52 40M32 40L52 24M32 40L52 40M32 52L52 40" opacity="0.55" strokeWidth="1.4" />
          {[18, 32, 46].map((y) => (
            <circle key={`a${y}`} cx="12" cy={y} r="3.6" fill="#05030a" />
          ))}
          {[12, 26, 40, 52].map((y) => (
            <circle key={`b${y}`} cx="32" cy={y} r="3.6" fill="#05030a" />
          ))}
          {[24, 40].map((y) => (
            <circle key={`c${y}`} cx="52" cy={y} r="3.6" fill="#05030a" />
          ))}
        </>
      )}
      {kind === "java" && (
        <>
          <path d="M15 29h29v10a13 13 0 0 1-13 13h-3A13 13 0 0 1 15 39z" />
          <path d="M44 32h3.5a5.5 5.5 0 0 1 0 11H43" />
          <path d="M10 57h40" />
          <path d="M23 23q-3.2-4 0-8t0-8M31 23q-3.2-4 0-8t0-8M39 23q-3.2-4 0-8t0-8" />
        </>
      )}
    </svg>
  );
}
