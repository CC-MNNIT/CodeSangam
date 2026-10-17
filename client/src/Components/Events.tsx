import { CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import { route } from "../Utils/Config";
import { EVENTS } from "../lib/events";
import RuneGlyph from "../ui/art/RuneGlyph";

interface props {
  currentSelected: string;
}

/**
 * Event switcher shown on the leaderboard pages: one tab per universe, each
 * lit in its own colour when selected.
 */
export default function Events({ currentSelected }: props) {
  return (
    <nav
      aria-label="Leaderboards"
      className="fixed inset-x-0 top-[4.5rem] z-40 flex justify-center px-3 md:top-[5.25rem]"
    >
      <ul className="scrollbar-none flex max-w-full snap-x gap-1 overflow-x-auto rounded-full bg-void-900/80 p-1.5 ring-1 ring-white/10 backdrop-blur-xl shadow-slab">
        {EVENTS.map((e) => {
          const active = currentSelected === e.tag;
          return (
            <li key={e.tag} className="snap-center" style={{ ["--tint" as string]: e.tint } as CSSProperties}>
              <NavLink
                to={route(`leaderboard/${e.tag}`)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 font-display text-[0.68rem] font-semibold uppercase tracking-rune transition-colors duration-500 ease-arcane focus-ring md:px-5 ${
                  active
                    ? "bg-tint/15 text-tint ring-1 ring-tint/70"
                    : "text-bone-300 hover:bg-white/5 hover:text-bone-50"
                }`}
              >
                <RuneGlyph kind={e.glyph} className="h-4 w-4 shrink-0" />
                {e.name}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
