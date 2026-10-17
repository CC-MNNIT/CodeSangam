import { Member, Team } from "../Models/EventModel";
import AvatarFrame from "../ui/AvatarFrame";
import RankSigil from "../ui/art/RankSigil";
import { MEDAL_TINT, Plinth, ScrollHint, tintStyle } from "./Leaderboard/shared";

interface Prop {
  teams: Team[];
}

type Rank = 1 | 2 | 3;

function getFirstName(name: string): string {
  const words: string[] = name.split(" ");
  return words[0];
}

function getLastName(name: string): string {
  const words: string[] = name.split(" ");
  return words.length > 1 ? words[words.length - 1] : "";
}

const ORDER: Record<Rank, string> = {
  1: "order-1 md:order-2",
  2: "order-2 md:order-1",
  3: "order-3 md:order-3",
};

/**
 * Members stand in the order the site has always used: the second member to
 * the left, the first in the middle (larger), the third to the right.
 */
function arrange(members: Member[]) {
  return [
    members[1] && { m: members[1], lead: false },
    members[0] && { m: members[0], lead: true },
    members[2] && { m: members[2], lead: false },
  ].filter(Boolean) as { m: Member; lead: boolean }[];
}

function TeamColumn({ rank, team }: { rank: Rank; team: Team }) {
  const lineup = arrange(team.members);
  return (
    <div data-col className={`${ORDER[rank]} flex w-full max-w-[26rem] flex-col items-center justify-self-center`}>
      <div data-col-in className="flex w-full flex-col items-center">
        <div className="relative flex w-full items-end justify-center gap-2 sm:gap-4" style={tintStyle(MEDAL_TINT[rank])}>
          <div
            aria-hidden="true"
            className="absolute inset-x-[-10%] bottom-0 top-[-20%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--tint)/0.2),transparent)] motion-safe:animate-breathe"
          />
          {lineup.map(({ m, lead }) => (
            <div key={m.reg_no + m.name} className="relative z-10 flex min-w-0 flex-1 flex-col items-center">
              <AvatarFrame
                src={m.avatar}
                alt={m.name}
                tint={MEDAL_TINT[rank]}
                size={lead ? "h-24 w-24 sm:h-28 sm:w-28" : "h-[4.75rem] w-[4.75rem] sm:h-[5.5rem] sm:w-[5.5rem]"}
              />
              <p className="mt-4 max-w-full truncate text-center font-display text-[0.8rem] font-semibold tracking-[0.06em] text-bone-50">
                {getFirstName(m.name)}
              </p>
              <p className="max-w-full truncate text-center text-[0.78rem] text-bone-200">{getLastName(m.name)}</p>
              <p className="mt-0.5 text-center text-[0.7rem] tabular-nums text-bone-300">{m.reg_no}</p>
            </div>
          ))}
          <RankSigil
            rank={rank}
            className="absolute -top-10 left-1/2 h-14 w-14 -translate-x-1/2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
          />
        </div>

        <Plinth rank={rank} size="lg" className="mt-6 flex-col gap-1.5 px-4">
          <span className="font-display text-4xl font-semibold text-tint text-glow md:text-5xl">#{rank}</span>
          <span className="max-w-full truncate font-display text-sm font-semibold uppercase tracking-rune text-bone-50">
            {team.name}
          </span>
        </Plinth>
      </div>
    </div>
  );
}

export default function EventsPodium({ teams }: Prop) {
  const [firstTeam, secondTeam, thirdTeam] = teams;
  return (
    <section data-podium className="relative min-h-[100svh] overflow-x-clip px-4 pb-36 pt-48 md:px-8 md:pt-52">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-end gap-20 md:grid-cols-3 md:gap-6">
        {secondTeam && <TeamColumn rank={2} team={secondTeam} />}
        {firstTeam && <TeamColumn rank={1} team={firstTeam} />}
        {thirdTeam && <TeamColumn rank={3} team={thirdTeam} />}
      </div>
      <ScrollHint />
    </section>
  );
}
