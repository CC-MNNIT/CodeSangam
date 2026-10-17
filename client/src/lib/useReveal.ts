import { DependencyList, RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useGsap } from "./useGsap";

/**
 * Fades `[data-reveal]` descendants up into place the first time they enter
 * the viewport, staggered when several arrive together. Content is visible by
 * default; the hidden start state exists only while the animation is armed.
 */
export function useReveal(scope: RefObject<HTMLElement>, deps: DependencyList = []) {
  useGsap(
    scope,
    ({ motion }, q) => {
      if (!motion) return;
      const items = q("[data-reveal]");
      if (!items.length) return;
      gsap.set(items, { autoAlpha: 0, y: 34 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.1,
            overwrite: true,
          }),
      });
    },
    deps
  );
}
