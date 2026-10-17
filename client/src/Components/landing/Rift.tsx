import { useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useGsap } from "../../lib/useGsap";
import Fracture from "../../ui/art/Fracture";
import SlingRing from "../../ui/art/SlingRing";

/**
 * Chapter two — the Fracture. Reality cracks outward from the centre and a
 * portal ring opens and dissolves into the first universe. Wordless: the scroll *is* the story.
 *
 * Without motion this chapter collapses to a short still of the cracked void.
 */
export default function Rift() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ motion }, q) => {
    if (!motion) return;
    const cracks = q(".crack");
    gsap.set(cracks, { strokeDashoffset: 1 });

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      })
      // The crack spreads, glow first then the white-hot core.
      .to(cracks, { strokeDashoffset: 0, duration: 0.5, stagger: { each: 0.006 } }, 0)
      // The fracture itself drifts toward the camera as the portal opens.
      .to(q("[data-cracks]"), { scale: 1.35, duration: 0.8 }, 0.2)
      .fromTo(q("[data-ring]"), { scale: 0.05, autoAlpha: 0, rotate: -90 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.3, ease: "power2.out" }, 0.45)
      .to(q("[data-ring]"), { scale: 1.9, rotate: 60, duration: 0.3, ease: "power1.in" }, 0.75)
      .to(q("[data-ring]"), { autoAlpha: 0, duration: 0.15 }, 0.85)
      // The disc inside the ring is the universe on the other side; it grows
      // until it is the whole screen.
      .fromTo(q("[data-disc]"), { scale: 0.05, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0.45)
      .to(q("[data-disc]"), { scale: 1.5, autoAlpha: 0, duration: 0.3, ease: "power1.in" }, 0.72)
      .to(q("[data-cracks]"), { autoAlpha: 0, duration: 0.18 }, 0.82);
  });

  return (
    <section
      ref={root}
      aria-hidden="true"
      className="relative h-[34svh] motion-safe:-mt-[100svh] motion-safe:h-[220svh]"
    >
      <div className="sticky top-0 h-[34svh] overflow-hidden motion-safe:h-[100svh]">
        {/* The crack */}
        <div data-cracks className="absolute inset-0 will-parallax">
          <Fracture className="h-full w-full" />
        </div>

        {/* Portal */}
        <div className="absolute inset-0 grid place-content-center place-items-center">
          <div
            data-disc
            className="absolute h-[min(52svh,64vw)] w-[min(52svh,64vw)] rounded-full will-parallax invisible"
            style={{
              background:
                "radial-gradient(closest-side, rgb(139 92 246 / 0.55) 0%, rgb(59 29 122 / 0.45) 45%, rgb(18 9 31 / 0) 100%)",
            }}
          />
          <div data-ring className="will-parallax invisible">
            <SlingRing tint="167 139 250" className="w-[min(72svh,88vw)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
