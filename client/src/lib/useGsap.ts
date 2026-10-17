import { DependencyList, RefObject, useLayoutEffect } from "react";
import { gsap } from "./gsap";

export interface MotionConditions {
  /** No `prefers-reduced-motion`: scroll-linked animation may run. */
  motion: boolean;
  /** `prefers-reduced-motion: reduce`: show the final, static composition. */
  reduce: boolean;
  /** ≥1024px: pinned/horizontal stages are used instead of vertical flow. */
  wide: boolean;
  /** ≥768px */
  medium: boolean;
}

/**
 * Runs `setup` inside a GSAP matchMedia scope tied to `scope`.
 *
 * Everything created in `setup` (tweens, ScrollTriggers, listeners) is reverted
 * automatically on unmount or when a media condition flips, so components never
 * leak triggers across route changes.
 */
export function useGsap(
  scope: RefObject<HTMLElement>,
  setup: (
    conditions: MotionConditions,
    q: ReturnType<typeof gsap.utils.selector>
  ) => void | (() => void),
  deps: DependencyList = []
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
        wide: "(min-width: 1024px)",
        medium: "(min-width: 768px)",
      },
      (ctx) => setup(ctx.conditions as unknown as MotionConditions, q),
      root
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
