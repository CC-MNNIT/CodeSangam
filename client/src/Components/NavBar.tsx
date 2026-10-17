import { CSSProperties, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { route } from "../Utils/Config";
import { EVENTS } from "../lib/events";
import { scrollToTarget } from "../lib/scrollTargets";
import logo from "../Assets/cc2025.svg";
import GlyphButton from "../ui/GlyphButton";
import Mandala from "../ui/art/Mandala";

const link =
  "relative py-2 font-display text-[0.78rem] font-semibold uppercase tracking-rune text-bone-200 transition-colors duration-500 ease-arcane hover:text-bone-50 focus-ring " +
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-sling-400 after:transition-transform after:duration-500 after:ease-arcane " +
  "hover:after:scale-x-100 aria-[current=page]:text-bone-50 aria-[current=page]:after:scale-x-100";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sheet = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  const home = route();
  const onHome = pathname.replace(/\/+$/, "") === home.replace(/\/+$/, "");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu sheet: lock page scroll, Escape closes, focus moves in and back out.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    sheet.current?.querySelector<HTMLElement>("a")?.focus();
    const btn = toggle.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const goHome = () => {
    setOpen(false);
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  };

  const goEvents = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (onHome) {
      scrollToTarget("events");
    } else {
      navigate(home, { state: { scrollTo: "events" } });
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-700 ease-arcane ${
        scrolled && !open
          ? "bg-void-950/75 shadow-[0_1px_0_0_rgb(255_255_255/0.07),0_18px_40px_-24px_rgb(0_0_0/0.9)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto grid h-[4.5rem] max-w-[1500px] grid-cols-[1fr_auto] items-center gap-6 px-5 md:h-20 md:grid-cols-[1fr_auto_1fr] md:px-9"
      >
        <NavLink
          to={home}
          onClick={goHome}
          aria-label="CodeSangam home"
          className="relative z-[60] justify-self-start rounded-lg focus-ring"
        >
          <img src={logo} alt="" className="h-12 w-auto md:h-14" />
        </NavLink>

        {/* Desktop */}
        <ul className="hidden items-center gap-10 md:flex">
          <li>
            <NavLink to={home} end onClick={goHome} className={link}>
              HOME
            </NavLink>
          </li>
          <li>
            <a href={`${home}#events`} onClick={goEvents} className={link}>
              EVENTS
            </a>
          </li>
          <li>
            <NavLink to={route("leaderboard/webster")} className={link}>
              LEADERBOARDS
            </NavLink>
          </li>
          <li>
            <NavLink to={route("team")} className={link}>
              TEAM
            </NavLink>
          </li>
        </ul>

        <div className="hidden justify-self-end md:block">
          <GlyphButton href={route("api/auth")} size="sm">
            DASHBOARD
          </GlyphButton>
        </div>

        {/* Mobile toggle */}
        <button
          ref={toggle}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="relative z-[60] grid h-12 w-12 place-items-center justify-self-end rounded-full ring-1 ring-white/15 transition-colors duration-500 hover:ring-sling-400/60 md:hidden focus-ring"
        >
          <span className="sr-only">{open ? "Close main menu" : "Open main menu"}</span>
          <span aria-hidden="true" className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-bone-50 transition duration-500 ease-arcane ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-px bg-bone-50 transition-all duration-500 ease-arcane ${
                open ? "w-0 opacity-0" : "w-3/4"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-px w-full bg-bone-50 transition duration-500 ease-arcane ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile sheet: opens as a portal growing from the toggle */}
      <div
        id="mobile-menu"
        ref={sheet}
        className={`fixed inset-0 z-[55] overflow-y-auto overflow-x-hidden bg-void-950 md:hidden ${
          open
            ? "visible [clip-path:circle(150%_at_calc(100%-2.75rem)_2.25rem)] [transition:clip-path_0.9s_cubic-bezier(0.16,1,0.3,1),visibility_0s]"
            : "invisible [clip-path:circle(0%_at_calc(100%-2.75rem)_2.25rem)] [transition:clip-path_0.7s_cubic-bezier(0.65,0,0.35,1),visibility_0s_0.7s]"
        }`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 w-[140vmax] -translate-x-1/2 -translate-y-1/2 text-arcane-300 opacity-[0.07]">
          <Mandala spin={false} />
        </div>
        <ul className="relative mx-auto flex min-h-full max-w-md flex-col justify-center gap-7 px-9 pb-12 pt-28">
          {[
            { key: "home", node: <NavLink to={home} end onClick={goHome} className={mobileLink}>HOME</NavLink> },
            { key: "events", node: <a href={`${home}#events`} onClick={goEvents} className={mobileLink}>EVENTS</a> },
            {
              key: "lb",
              node: (
                <>
                  <NavLink to={route("leaderboard/webster")} className={mobileLink}>
                    LEADERBOARDS
                  </NavLink>
                  <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="RANKINGS">
                    {EVENTS.map((ev) => (
                      <NavLink
                        key={ev.tag}
                        to={route(`leaderboard/${ev.tag}`)}
                        style={{ ["--tint" as string]: ev.tint } as CSSProperties}
                        className="rounded-full px-3.5 py-1.5 font-display text-[0.66rem] font-semibold uppercase tracking-rune text-bone-300 ring-1 ring-white/15 transition-colors duration-500 hover:text-tint aria-[current=page]:text-tint aria-[current=page]:ring-tint focus-ring"
                      >
                        {ev.name}
                      </NavLink>
                    ))}
                  </div>
                </>
              ),
            },
            { key: "team", node: <NavLink to={route("team")} className={mobileLink}>TEAM</NavLink> },
            {
              key: "dash",
              node: (
                <GlyphButton href={route("api/auth")} size="md">
                  DASHBOARD
                </GlyphButton>
              ),
            },
          ].map((item, i) => (
            <li
              key={item.key}
              className={`transition duration-700 ease-arcane ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{ transitionDelay: open ? `${180 + i * 70}ms` : "0ms" }}
            >
              {item.node}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

const mobileLink =
  "block font-display text-[2rem] font-semibold uppercase tracking-[0.14em] text-bone-200 transition-colors duration-500 hover:text-bone-50 aria-[current=page]:text-sling-400 focus-ring";
