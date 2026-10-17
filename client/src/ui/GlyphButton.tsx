import { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  /** Plain anchor (leaves the SPA, e.g. to the Go-served dashboard). */
  href?: string;
  /** Client-side route. */
  to?: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  /** Renders a non-interactive, visibly inert control. */
  disabled?: boolean;
  /** `sling` is always gold; `tint` follows the surrounding universe. */
  tone?: "sling" | "tint";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
}

const SIZE = {
  sm: "px-5 py-2 text-[0.68rem]",
  md: "px-7 py-3 text-[0.74rem]",
  lg: "px-9 py-4 text-[0.82rem]",
} as const;

/**
 * The site's one button: a pill whose rim carries an orbiting spark, like a
 * sling ring being drawn. Used for every primary action.
 */
export default function GlyphButton({
  children,
  href,
  to,
  target,
  rel,
  onClick,
  disabled,
  tone = "sling",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: Props) {
  const edge = tone === "sling" ? "bg-sling-edge" : "bg-tint-edge";
  const glow = tone === "sling" ? "group-hover:shadow-ring" : "group-hover:shadow-portal";
  const fill =
    tone === "sling"
      ? "group-hover:bg-sling-500/15 group-focus-visible:bg-sling-500/15"
      : "group-hover:bg-tint/15 group-focus-visible:bg-tint/15";

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 -ml-[130%] -mt-[130%] aspect-square w-[260%] ${
          disabled ? "bg-white/10" : `${edge} motion-safe:animate-spin-fast`
        } transition-opacity duration-500 ${disabled ? "" : "opacity-70 group-hover:opacity-100"}`}
      />
      <span
        className={`relative flex flex-1 items-center justify-center gap-3 rounded-full bg-void-900 font-display font-semibold uppercase tracking-rune transition-colors duration-500 ease-arcane ${
          SIZE[size]
        } ${disabled ? "text-bone-400" : `text-bone-50 ${fill}`}`}
      >
        {children}
      </span>
    </>
  );

  const cls = `group relative inline-flex overflow-hidden rounded-full p-px transition-shadow duration-500 ease-arcane focus-ring ${
    disabled ? "cursor-not-allowed" : glow
  } ${className}`;

  if (disabled) {
    return (
      <span className={cls} role="button" aria-disabled="true" tabIndex={0}>
        {inner}
      </span>
    );
  }
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={cls} aria-label={rest["aria-label"]}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className={cls} aria-label={rest["aria-label"]}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={rest["aria-label"]}>
      {inner}
    </button>
  );
}
