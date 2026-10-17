import { RefObject } from "react";
import { gsap } from "../../lib/gsap";
import { useGsap } from "../../lib/useGsap";

/**
 * Podium choreography. On arrival the three columns rise from the centre
 * outward; scrolling toward the full standings lifts the podium away at three
 * different speeds and lets it fall into shadow.
 *
 * Markup contract: `[data-podium]` is the section, `[data-col]` each column,
 * `[data-col-in]` the first child of each column (intro target).
 */
export function usePodiumMotion(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  useGsap(
    scope,
    ({ motion }, q) => {
      if (!motion) return;
      const cols = q("[data-col]");
      if (!cols.length) return;

      gsap.from(q("[data-col-in]"), {
        autoAlpha: 0,
        y: 90,
        scale: 0.94,
        duration: 1.5,
        ease: "expo.out",
        stagger: { each: 0.16, from: "center" },
        delay: 0.1,
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q("[data-podium]")[0],
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      cols.forEach((c, i) => {
        const centre = i === Math.floor(cols.length / 2);
        tl.to(c, { yPercent: centre ? -9 : -20, autoAlpha: 0.12 }, 0);
      });
    },
    deps as []
  );
}
