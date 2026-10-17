import { CSSProperties, useEffect, useRef, useState } from "react";
import { TeamMember, Year } from "../Utils/TeamMember";
import { gsap } from "../lib/gsap";
import { useGsap } from "../lib/useGsap";
import { useReveal } from "../lib/useReveal";
import AvatarFrame from "../ui/AvatarFrame";
import Mandala from "../ui/art/Mandala";
import { GithubIcon, LinkedinIcon, XIcon } from "../ui/art/SocialIcons";

/** Each year of the tech team is a chamber of the Sanctum. */
const TINTS = ["167 139 250", "255 179 71", "76 199 245", "78 234 168"];

const social =
  "grid h-10 w-10 place-items-center rounded-full text-bone-300 ring-1 ring-white/15 transition duration-500 ease-arcane hover:-translate-y-0.5 hover:text-tint hover:ring-tint hover:shadow-portal focus-ring";

export default function Team() {
  const [activeYear, setActiveYear] = useState<string | null>("26-27");
  // Lets the first chamber animate open on arrival instead of appearing open.
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useReveal(root);

  // The great mandala above the chambers turns and rises as you scroll.
  useGsap(root, ({ motion }, q) => {
    if (!motion) return;
    gsap.to(q("[data-sanctum]"), {
      rotate: 70,
      yPercent: -16,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
    });
  });

  const toggle = (year: string) => setActiveYear((cur) => (cur === year ? null : year));

  return (
    <main ref={root} className="relative overflow-clip px-5 pb-40 pt-40 md:pt-52 [--tint:167_139_250]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-6rem] w-[min(120vw,64rem)] -translate-x-1/2 md:top-[-9rem]"
      >
        <div data-sanctum className="will-parallax">
          <Mandala className="w-full text-arcane-300 opacity-[0.3]" />
        </div>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-5">
        {Year.map((year, index) => {
          const open = ready && activeYear === year;
          const members = TeamMember.year[index][year];
          const tint = TINTS[index % TINTS.length];
          return (
            <section
              key={year}
              data-reveal
              style={{ ["--tint" as string]: tint } as CSSProperties}
              className="rounded-[2rem] bg-void-900/60 ring-1 ring-white/10 shadow-slab transition-colors duration-700 data-[open=true]:bg-void-800/70 data-[open=true]:ring-tint/40"
              data-open={open}
            >
              <h2>
                <button
                  type="button"
                  onClick={() => toggle(year)}
                  aria-expanded={open}
                  aria-controls={`team-${year}`}
                  className="group flex w-full items-center justify-between gap-6 rounded-[2rem] px-6 py-6 text-left focus-ring md:px-10 md:py-8"
                >
                  <span className="flex items-center gap-5">
                    <span
                      aria-hidden="true"
                      className="relative hidden h-12 w-12 shrink-0 place-items-center rounded-full ring-1 ring-tint/50 sm:grid"
                    >
                      <span className="absolute inset-1.5 rounded-full border border-dashed border-tint/50 motion-safe:animate-spin-medium" />
                      <span className="h-1.5 w-1.5 rotate-45 bg-tint" />
                    </span>
                    <span className="font-display text-[clamp(1.35rem,3.4vw,2.2rem)] font-semibold tracking-[0.06em] text-bone-50 text-glow">
                      Tech-Team {year}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-bone-200 ring-1 ring-white/15 transition duration-700 ease-arcane group-hover:text-tint group-hover:ring-tint/60"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-5 w-5 transition-transform duration-700 ease-arcane ${open ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
              </h2>

              <div
                id={`team-${year}`}
                role="region"
                aria-label={`Tech-Team ${year}`}
                className={`grid transition-[grid-template-rows,visibility] duration-[900ms] ease-arcane ${
                  open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr] [transition-delay:0s,0.9s]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <ul className="flex flex-wrap justify-center gap-y-14 px-4 pb-14 pt-6 md:px-10">
                    {members.map((member, i) => (
                      <li
                        key={i}
                        className={`flex w-1/2 flex-col items-center px-1.5 md:w-1/3 lg:w-1/4 transition duration-[900ms] ease-arcane ${
                          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-90 opacity-0"
                        }`}
                        style={{ transitionDelay: open ? `${150 + i * 70}ms` : "0ms" }}
                      >
                        <AvatarFrame
                          src={member.image}
                          alt={member.name}
                          size="h-32 w-32 md:h-40 md:w-40"
                          className="transition-transform duration-700 ease-arcane hover:scale-105"
                        />
                        <p className="mt-9 text-center font-display text-base font-semibold tracking-[0.06em] text-bone-50 md:text-lg">
                          {member.name}
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-3">
                          {member.github && (
                            <a href={member.github} target="_blank" rel="noreferrer" aria-label={`${member.name} on GitHub`} className={social}>
                              <GithubIcon className="h-[1.15rem] w-[1.15rem]" />
                            </a>
                          )}
                          {member.twitter && (
                            <a href={member.twitter} target="_blank" rel="noreferrer" aria-label={`${member.name} on X`} className={social}>
                              <XIcon className="h-4 w-4" />
                            </a>
                          )}
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`} className={social}>
                              <LinkedinIcon className="h-[1.15rem] w-[1.15rem]" />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
