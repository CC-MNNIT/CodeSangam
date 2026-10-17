import { CSSProperties, useLayoutEffect, useRef } from "react";
import { EVENTS } from "../../lib/events";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useGsap } from "../../lib/useGsap";
import { registerScrollTarget } from "../../lib/scrollTargets";
import GlyphButton from "../../ui/GlyphButton";
import GlyphMedal from "../../ui/art/GlyphMedal";
import Mandala from "../../ui/art/Mandala";
import RuneGlyph from "../../ui/art/RuneGlyph";

const N = EVENTS.length;

/** CSS custom-property bag, typed. */
const tintVar = (tint: string) => ({ ["--tint" as string]: tint } as CSSProperties);

/**
 * Chapter three — the Multiverse. One universe per event. On wide
 * screens the stage pins and scroll carries you sideways through them, every
 * layer (aura, portal, text) travelling at its own speed; everywhere else the
 * universes simply stack and drift as you pass.
 */
export default function Multiverse() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(
    () =>
      registerScrollTarget("events", () => {
        const el = root.current;
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      }),
    []
  );

  useGsap(root, ({ motion, wide }, q) => {
    if (!motion) return;
    const panels = q("[data-panel]") as HTMLElement[];

    // ---- Stacked: parallax drift + reveal as each universe is passed -------
    if (!wide) {
      panels.forEach((p) => {
        const medal = p.querySelector("[data-medal]");
        const aura = p.querySelector("[data-aura]");
        const text = p.querySelector("[data-text]");
        if (medal)
          gsap.fromTo(
            medal,
            { y: 46, rotate: -10 },
            {
              y: -46,
              rotate: 10,
              ease: "none",
              scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        if (aura)
          gsap.fromTo(
            aura,
            { rotate: -20, scale: 0.9 },
            {
              rotate: 20,
              scale: 1.1,
              ease: "none",
              scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        if (text)
          gsap.from(text, {
            autoAlpha: 0,
            y: 44,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: p, start: "top 72%", once: true },
          });
      });
      return;
    }

    // ---- Wide: pinned stage, sideways travel through the universes ---------
    const track = q("[data-track]")[0] as HTMLElement;
    const bar = q("[data-bar]")[0] as HTMLElement;
    const dots = q("[data-dot]") as HTMLElement[];
    const parts = panels.map((p) => ({
      medal: p.querySelector("[data-medal]") as HTMLElement,
      aura: p.querySelector("[data-aura]") as HTMLElement,
      text: p.querySelector("[data-text]") as HTMLElement,
      ghost: p.querySelector("[data-ghost]") as HTMLElement,
      chars: Array.from(p.querySelectorAll("[data-char]")) as HTMLElement[],
    }));

    const state = { target: 0, cur: 0 };
    let lastDot = -1;

    const apply = () => {
      const p = state.cur * (N - 1);
      const vw = window.innerWidth;
      gsap.set(track, { xPercent: -(100 / N) * p });
      parts.forEach((pt, i) => {
        const d = p - i;
        const a = Math.min(1, Math.abs(d));
        // Portal: nearer than the page — slides faster, shrinks and spins away.
        gsap.set(pt.medal, {
          x: -d * vw * 0.2,
          scale: 1 - 0.24 * a,
          rotate: d * 26,
          autoAlpha: 1 - a * 0.92,
        });
        // Aura: farther than the page — lags behind.
        gsap.set(pt.aura, { x: d * vw * 0.26, scale: 1 + 0.18 * a, autoAlpha: 1 - a * 0.85 });
        // Words: a touch slower than the page so they settle last.
        gsap.set(pt.text, { x: d * vw * 0.09, autoAlpha: 1 - Math.min(1, a * 1.4) });
        // Giant outlined name: the farthest layer, sliding against the travel.
        gsap.set(pt.ghost, { x: d * vw * 0.45 });
        // Only universes on (or next to) the screen keep their art turning.
        panels[i].setAttribute("data-near", String(Math.abs(d) < 1.05));
      });
      gsap.set(bar, { scaleX: p / (N - 1) });
      const active = Math.round(p);
      if (active !== lastDot) {
        const first = lastDot === -1;
        lastDot = active;
        dots.forEach((el, i) => el.setAttribute("data-active", String(i === active)));
        // Arrival: the universe's name assembles letter by letter.
        if (!first)
          gsap.fromTo(
            parts[active].chars,
            { yPercent: 70, rotateX: -70, autoAlpha: 0 },
            {
              yPercent: 0,
              rotateX: 0,
              autoAlpha: 1,
              duration: 1,
              ease: "expo.out",
              stagger: 0.035,
              overwrite: true,
            }
          );
      }
    };

    const tick = (_t: number, deltaMs: number) => {
      const diff = state.target - state.cur;
      if (Math.abs(diff) < 0.00005) return;
      // Frame-rate independent ease toward the scroll position.
      state.cur += diff * (1 - Math.exp(-(deltaMs / 1000) * 9));
      apply();
    };

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        state.target = self.progress;
      },
      snap: {
        snapTo: 1 / (N - 1),
        duration: { min: 0.2, max: 0.7 },
        delay: 0.12,
        ease: "power2.inOut",
      },
    });
    state.target = state.cur = st.progress;
    apply();
    gsap.ticker.add(tick);

    const onDot = (e: Event) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.dot);
      const range = st.end - st.start;
      window.scrollTo({ top: st.start + (i / (N - 1)) * range, behavior: "smooth" });
    };
    dots.forEach((d) => d.addEventListener("click", onDot));

    return () => {
      gsap.ticker.remove(tick);
      dots.forEach((d) => d.removeEventListener("click", onDot));
    };
  });

  return (
    <section
      ref={root}
      id="events"
      className="relative lg:motion-safe:h-[390svh]"
    >
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-[100svh] lg:motion-safe:overflow-hidden">
        <div
          data-track
          className="flex flex-col lg:motion-safe:h-full lg:motion-safe:w-[400vw] lg:motion-safe:flex-row lg:motion-safe:will-parallax"
        >
          {EVENTS.map((e) => (
            <article
              key={e.tag}
              data-panel
              style={tintVar(e.tint)}
              data-near="true"
              className="relative flex min-h-[100svh] overflow-x-clip lg:motion-safe:overflow-visible data-[near=false]:[&_*]:[animation-play-state:paused] flex-col items-center justify-center gap-10 px-6 py-24 lg:motion-safe:h-full lg:motion-safe:min-h-0 lg:motion-safe:w-screen lg:motion-safe:flex-row lg:motion-safe:gap-[5vw] lg:motion-safe:px-[7vw] lg:motion-safe:py-0"
            >
              {/* Universe light */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_46%_at_50%_30%,rgb(var(--tint)/0.2),transparent_72%)] lg:motion-safe:bg-[radial-gradient(52%_64%_at_30%_50%,rgb(var(--tint)/0.22),transparent_72%)]"
              />

              {/* The universe's name, vast and hollow, at the farthest depth */}
              <div
                data-ghost
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[calc(50%-8.5vw)] hidden select-none justify-center overflow-visible whitespace-nowrap font-display text-[17vw] font-bold uppercase leading-none tracking-[0.04em] text-transparent [-webkit-text-stroke:1px_rgb(var(--tint)/0.1)] lg:motion-safe:flex lg:motion-safe:will-parallax"
              >
                {e.name}
              </div>

              {/* Portal + the vast rune-wheel behind it */}
              <div className="relative z-10 grid w-[min(74vw,26rem)] shrink-0 place-items-center lg:motion-safe:w-[min(58svh,34vw)]">
                <div
                  data-aura
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 w-[190%] -translate-x-1/2 -translate-y-1/2 will-parallax"
                >
                  <Mandala spin={false} className="w-full text-tint opacity-[0.17]" />
                </div>
                <div data-medal className="relative w-full will-parallax">
                  <GlyphMedal kind={e.glyph} tint={e.tint} />
                </div>
              </div>

              {/* Words */}
              <div
                data-text
                className="relative z-10 max-w-[34rem] text-center will-parallax lg:motion-safe:text-left"
              >
                <h2
                  aria-label={e.name}
                  className="font-display text-[clamp(2.2rem,5.6vw,4.4rem)] font-semibold uppercase leading-[1.05] tracking-[0.06em] text-bone-50 text-glow [perspective:600px]"
                >
                  {e.name.split(" ").map((word, w) => (
                    <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
                      {Array.from(word).map((ch, c) => (
                        <span key={c} data-char className="inline-block will-change-transform">
                          {ch}
                        </span>
                      ))}
                      {w < e.name.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
                    </span>
                  ))}
                </h2>
                <span
                  aria-hidden="true"
                  className="mx-auto mt-6 block h-px w-28 bg-gradient-to-r from-transparent via-tint to-transparent lg:motion-safe:mx-0 lg:motion-safe:from-tint lg:motion-safe:via-tint/50"
                />
                <p className="mt-6 text-[1.02rem] leading-[1.85] text-bone-200">{e.description}</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 lg:motion-safe:justify-start">
                  <p className="font-display text-[0.8rem] font-semibold uppercase tracking-rune text-tint">
                    {e.teamSize}
                  </p>
                  <GlyphButton href={e.url} target="_blank" rel="noreferrer" tone="tint">
                    Problem Statement
                  </GlyphButton>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Progress through the multiverse (wide, pinned only) */}
        <nav
          aria-label="Events"
          className="absolute inset-x-0 bottom-7 z-20 hidden justify-center lg:motion-safe:flex"
        >
          <div className="relative flex items-center gap-7 rounded-full bg-void-950/60 px-6 py-2.5 backdrop-blur-md">
            <span aria-hidden="true" className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-white/10" />
            <span
              data-bar
              aria-hidden="true"
              className="absolute inset-x-8 top-1/2 h-px origin-left -translate-y-1/2 scale-x-0 bg-sling-400"
            />
            {EVENTS.map((e, i) => (
              <button
                key={e.tag}
                type="button"
                data-dot={i}
                data-active={i === 0}
                aria-label={e.name}
                title={e.name}
                style={tintVar(e.tint)}
                className="group relative grid h-11 w-11 place-items-center rounded-full bg-void-900 text-bone-300 ring-1 ring-white/15 transition duration-500 ease-arcane hover:text-tint focus-ring data-[active=true]:scale-110 data-[active=true]:text-tint data-[active=true]:ring-tint data-[active=true]:shadow-portal"
              >
                <RuneGlyph kind={e.glyph} className="h-[55%] w-[55%]" />
              </button>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
