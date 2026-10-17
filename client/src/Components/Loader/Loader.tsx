import SlingRing from "../../ui/art/SlingRing";

/** A portal slowly opening — shown while a leaderboard is being fetched. */
export default function Loader() {
  return (
    <div
      role="status"
      className="grid min-h-[100svh] place-items-center"
    >
      <span className="sr-only">Loading</span>
      <div className="relative w-[min(62vw,22rem)] motion-safe:animate-portal-open">
        <SlingRing />
        <div
          aria-hidden="true"
          className="absolute inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(255_179_71/0.5),rgb(255_143_31/0.12)_70%,transparent)] motion-safe:animate-breathe"
        />
      </div>
    </div>
  );
}
