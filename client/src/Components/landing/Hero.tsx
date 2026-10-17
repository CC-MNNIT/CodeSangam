import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useGsap } from "../../lib/useGsap";
import { registerScrollTarget } from "../../lib/scrollTargets";
import SlingRing from "../../ui/art/SlingRing";
import Mandala from "../../ui/art/Mandala";

// "CODESANGAM" with the O drawn as a portal.
const LEFT = ["C"];
const RIGHT = ["D", "E", "S", "A", "N", "G", "A", "M"];

const letter =
  "inline-block will-change-transform font-display font-semibold text-bone-50 text-glow";

/**
 * Chapter one — the Prologue. The sling ring and the wordmark are the whole
 * first viewport. Scrolling flies the camera *through* the ring: the ring and
 * mandala swell past you while the
 * mandala turns the other way.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(
    () => registerScrollTarget("top", () => 0),
    []
  );

  useGsap(root, ({ motion }, q) => {
    if (!motion) return;

    // Arrival: assembled once, on load.
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .from(q("[data-ring-in]"), { scale: 0.55, rotate: -60, autoAlpha: 0, duration: 2.6 }, 0)
      .from(q("[data-mandala-in]"), { scale: 0.7, autoAlpha: 0, duration: 3.2 }, 0)
      .from(
        q("[data-letter]"),
        { y: 70, autoAlpha: 0, filter: "blur(14px)", duration: 1.5, stagger: 0.07 },
        0.35
      )
      .from(q("[data-fade]"), { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.14 }, 1.3);

    // Travel: the camera passes through the ring.
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.7 },
      })
      .to(q("[data-ring]"), { scale: 2.6, rotate: 45 }, 0)
      .to(q("[data-ring]"), { autoAlpha: 0, duration: 0.35 }, 0.65)
      .to(q("[data-mandala]"), { scale: 1.9, rotate: -40 }, 0)
      .to(q("[data-mandala]"), { autoAlpha: 0, duration: 0.4 }, 0.6)
      .to(q("[data-word]"), { scale: 1.3, yPercent: -10 }, 0)
      .to(q("[data-word]"), { autoAlpha: 0, duration: 0.3 }, 0.35)
      .to(q("[data-cue]"), { autoAlpha: 0, duration: 0.1 }, 0)
;

    // Pointer parallax (fine pointers only): each layer leans at its own depth.
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const layers = q("[data-lean]").map((el) => ({
      xTo: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
      yTo: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
      depth: Number((el as HTMLElement).dataset.lean),
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => {
        l.xTo(nx * l.depth);
        l.yTo(ny * l.depth);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  });

  return (
    <section
      ref={root}
      aria-label="CodeSangam"
      className="relative h-[100svh] motion-safe:h-[175svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Mandala */}
        <div data-lean="-34" className="absolute inset-0 grid place-content-center place-items-center">
          <div data-mandala className="will-parallax">
            <div data-mandala-in className="will-parallax">
              <Mandala spin={false} className="w-[min(118svh,124vw)] text-arcane-300 opacity-[0.26]" />
            </div>
          </div>
        </div>

        {/* Sling ring */}
        <div data-lean="-52" className="absolute inset-0 grid place-content-center place-items-center">
          <div data-ring className="will-parallax">
            <div data-ring-in className="will-parallax">
              <SlingRing className="w-[min(80svh,92vw)]" />
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="absolute inset-0 grid place-items-center px-4">
          <div data-word className="will-parallax text-center">
            <h1
              aria-label="CodeSangam"
              className="flex items-baseline justify-center whitespace-nowrap text-[clamp(2.15rem,9.6vw,9.25rem)] leading-none tracking-[0.04em]"
            >
              <span aria-hidden="true" className="flex items-baseline">
                {LEFT.map((c, i) => (
                  <span key={`l${i}`} data-letter className={letter}>
                    {c}
                  </span>
                ))}
                <span
                  data-letter
                  className="relative mx-[0.03em] inline-block h-[0.7em] w-[0.8em] will-change-transform"
                >
                  <SlingRing className="absolute inset-[-4%]" />
                </span>
                {RIGHT.map((c, i) => (
                  <span key={`r${i}`} data-letter className={letter}>
                    {c}
                  </span>
                ))}
              </span>
            </h1>
          </div>
        </div>

        {/* Scroll cue: a spark running down a hairline */}
        <div
          data-cue
          aria-hidden="true"
          className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2"
        >
          <span data-fade className="relative block h-14 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-0 bg-gradient-to-b from-sling-300 to-sling-500 motion-safe:animate-line-down" />
          </span>
        </div>

      </div>
    </section>
  );
}
