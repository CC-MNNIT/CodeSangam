import { CSSProperties, useRef } from "react";
import { Link } from "react-router-dom";
import { EVENTS } from "../../lib/events";
import { gsap } from "../../lib/gsap";
import { useGsap } from "../../lib/useGsap";
import { route } from "../../Utils/Config";
import GlyphButton from "../../ui/GlyphButton";
import EyeOfAgamotto from "../../ui/art/EyeOfAgamotto";
import RuneGlyph from "../../ui/art/RuneGlyph";

/**
 * Chapter four — the Eye of Agamotto opens as you arrive. Beneath it, the five
 * universes as keys to their leaderboards, and the way into the Dashboard.
 */
export default function Finale() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ motion }, q) => {
    if (!motion) return;

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
      })
      // Eyelids rise from closed to open.
      .fromTo(q("[data-lid=top]"), { y: 0 }, { y: -150, duration: 0.45, ease: "power2.inOut" }, 0.05)
      .fromTo(q("[data-lid=bottom]"), { y: 0 }, { y: 150, duration: 0.45, ease: "power2.inOut" }, 0.05)
      .fromTo(q("[data-iris]"), { scale: 0.4 }, { scale: 1, duration: 0.45, ease: "power2.out" }, 0.1)
      .fromTo(q("[data-eye]"), { rotate: -18, scale: 0.8 }, { rotate: 0, scale: 1, duration: 0.5 }, 0)
      .fromTo(q("[data-halo]"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0.15)
      .fromTo(q("[data-key]"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.05, ease: "power2.out" }, 0.5)
      .fromTo(q("[data-cta]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.78);
  });

  return (
    <section ref={root} className="relative motion-safe:h-[150svh]">
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-[clamp(1rem,3.4svh,2.5rem)] overflow-hidden px-6 py-16 motion-safe:sticky motion-safe:top-0 motion-safe:h-[100svh] motion-safe:py-0">
        <div className="relative grid place-items-center">
          <div
            data-halo
            aria-hidden="true"
            className="absolute inset-[-38%] rounded-full bg-[radial-gradient(closest-side,rgb(78_234_168/0.28),rgb(139_92_246/0.12)_55%,transparent)] will-parallax"
          />
          <div data-eye className="relative will-parallax">
            <EyeOfAgamotto className="w-[min(50svh,84vw)]" />
          </div>
        </div>

        <ul className="flex items-center gap-[clamp(0.6rem,2.4vw,1.6rem)]">
          {EVENTS.map((e) => (
            <li key={e.tag} data-key style={{ ["--tint" as string]: e.tint } as CSSProperties}>
              <Link
                to={route(`leaderboard/${e.tag}`)}
                aria-label={`${e.name} leaderboard`}
                className="group relative grid h-[clamp(2.9rem,6.4vw,4rem)] w-[clamp(2.9rem,6.4vw,4rem)] place-items-center rounded-full bg-void-900 text-bone-300 ring-1 ring-white/15 transition duration-500 ease-arcane hover:-translate-y-1 hover:text-tint hover:shadow-portal hover:ring-tint focus-ring"
              >
                <RuneGlyph kind={e.glyph} className="h-[52%] w-[52%]" />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-7 whitespace-nowrap font-display text-[0.62rem] font-semibold uppercase tracking-rune text-tint opacity-0 transition duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {e.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div data-cta>
          <GlyphButton href={route("api/auth")} size="lg">
            Dashboard
          </GlyphButton>
        </div>
      </div>
    </section>
  );
}
