import { GlyphKind } from "../../lib/events";
import RuneGlyph from "./RuneGlyph";
import SlingRing from "./SlingRing";

interface Props {
  kind: GlyphKind;
  /** Universe colour "r g b". */
  tint: string;
  className?: string;
  spin?: boolean;
  /** Accessible name; omit when the medal is decoration next to a heading. */
  title?: string;
}

/**
 * An event's portal: the sling ring in the event's own colour with the event's
 * pictogram hovering at its centre.
 */
export default function GlyphMedal({ kind, tint, className = "", spin = true, title }: Props) {
  return (
    <div className={`relative aspect-square ${className}`} style={{ ["--tint" as string]: tint }}>
      <SlingRing tint={tint} spin={spin} className="absolute inset-0" />
      <div
        className="absolute inset-[27%] grid place-items-center rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--tint) / 0.2), rgb(var(--tint) / 0.05) 70%, transparent)",
        }}
      >
        <RuneGlyph
          kind={kind}
          title={title}
          className="h-[58%] w-[58%] text-tint [filter:drop-shadow(0_6px_14px_rgb(var(--tint)/0.7))] motion-safe:animate-drift"
        />
      </div>
    </div>
  );
}
