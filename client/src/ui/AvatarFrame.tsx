interface Props {
  src: string;
  alt: string;
  /** Ring colour as "r g b". Defaults to the surrounding universe. */
  tint?: string;
  /** Tailwind size classes for the whole frame (a square). */
  size?: string;
  className?: string;
}

/**
 * Photo in a sling-ring frame: a conic spark chasing round a thin ring, with
 * a dashed outer ring turning the other way. One cheap layer each, so a page
 * of a dozen of these stays smooth.
 */
export default function AvatarFrame({ src, alt, tint, size = "h-40 w-40", className = "" }: Props) {
  return (
    <div
      className={`relative ${size} ${className}`}
      style={tint ? ({ ["--tint" as string]: tint } as React.CSSProperties) : undefined}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-tint-edge [-webkit-mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-2px))] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-2px))] motion-safe:animate-spin-medium"
      />
      <div aria-hidden="true" className="absolute inset-0 rounded-full border border-tint/25" />
      <div
        aria-hidden="true"
        className="absolute -inset-2.5 rounded-full border border-dashed border-tint/40 motion-safe:animate-spin-rev"
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-[7px] h-[calc(100%-14px)] w-[calc(100%-14px)] rounded-full bg-void-800 object-cover shadow-slab"
      />
    </div>
  );
}
