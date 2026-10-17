import { Ranking } from "../Models/ContrihubModel";
import AvatarFrame from "../ui/AvatarFrame";
import RankSigil from "../ui/art/RankSigil";
import { MEDAL_TINT, Plinth, ScrollHint, tintStyle } from "./Leaderboard/shared";

interface props {
  first: Ranking;
  second: Ranking;
  third: Ranking;
}

type Rank = 1 | 2 | 3;

const ORDER: Record<Rank, string> = {
  1: "order-1 md:order-2",
  2: "order-2 md:order-1",
  3: "order-3 md:order-3",
};

function Column({ rank, user }: { rank: Rank; user: Ranking }) {
  const champion = rank === 1;
  return (
    <div data-col className={`${ORDER[rank]} flex w-full max-w-[19rem] flex-col items-center justify-self-center`}>
      <div data-col-in className="flex w-full flex-col items-center">
        <div className="relative" style={tintStyle(MEDAL_TINT[rank])}>
          <div
            aria-hidden="true"
            className="absolute inset-[-40%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--tint)/0.26),transparent)] motion-safe:animate-breathe"
          />
          <AvatarFrame
            src={`https://github.com/${user.user_name}.png`}
            alt={user.user_name}
            tint={MEDAL_TINT[rank]}
            size={champion ? "h-40 w-40 md:h-52 md:w-52" : "h-32 w-32 md:h-40 md:w-40"}
          />
          <RankSigil
            rank={rank}
            className={`absolute left-1/2 -translate-x-1/2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] ${
              champion ? "-top-9 h-16 w-16" : "-top-7 h-12 w-12"
            }`}
          />
        </div>

        <p className="mt-9 max-w-full truncate font-display text-lg font-semibold tracking-[0.08em] text-bone-50">
          {user.user_name}
        </p>
        <p className="mt-1 text-sm tabular-nums text-bone-300">{user.reg_no}</p>

        <Plinth rank={rank} className="mt-6">
          <span className="font-display text-4xl font-semibold text-tint text-glow md:text-5xl">#{rank}</span>
        </Plinth>
      </div>
    </div>
  );
}

export default function Podium({ first, second, third }: props) {
  return (
    <section data-podium className="relative min-h-[100svh] overflow-x-clip px-6 pb-36 pt-44 md:pt-48">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-end gap-14 md:grid-cols-3 md:gap-8">
        <Column rank={2} user={second} />
        <Column rank={1} user={first} />
        <Column rank={3} user={third} />
      </div>
      <ScrollHint />
    </section>
  );
}
