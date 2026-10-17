import { useEffect, useState } from "react";
import { route } from "../Utils/Config";

const pad = (n: number) => String(n).padStart(2, "0");

type DeadlineResponse = { deadline: number; passed: boolean };

/**
 * A quiet reminder of when registration closes, shown on the landing page.
 *
 * The cutoff is fetched from the server (GET /api/v1/cs/deadline) rather than
 * baked in at build time, so moving the date is a server-side edit and a
 * restart - no rebuild, and the countdown can never disagree with what the
 * server actually enforces. If the request fails, or no deadline is set, this
 * renders nothing at all.
 *
 * Fixed positioning keeps it out of the document flow, so it cannot disturb the
 * hero's pinned section. That does rely on no ancestor having a transform or
 * filter: the page wrapper only animates opacity, which is safe.
 */
export default function RegistrationCountdown() {
  const [state, setState] = useState<{ label: string; closed: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    let deadline = 0;

    // Returns true while there is still time to count down.
    const render = (until: number): boolean => {
      const left = until - Math.floor(Date.now() / 1000);
      if (cancelled) return false;
      if (left <= 0) {
        setState({ label: "Registration is closed", closed: true });
        return false;
      }
      const days = Math.floor(left / 86400);
      const hours = Math.floor((left % 86400) / 3600);
      const mins = Math.floor((left % 3600) / 60);
      const secs = left % 60;
      setState({
        label: (days > 0 ? `${days}d ` : "") + `${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`,
        closed: false,
      });
      return true;
    };

    // Background tabs throttle timers to about once a minute, so refresh the
    // value when the visitor comes back rather than showing a stale count.
    const onVisible = () => {
      if (!document.hidden && deadline) render(deadline);
    };
    document.addEventListener("visibilitychange", onVisible);

    fetch(route("api/v1/cs/deadline"), { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DeadlineResponse | null) => {
        if (!data || !data.deadline || cancelled) return;
        deadline = data.deadline;
        // No timer at all once the cutoff has already gone by.
        if (!render(deadline)) return;
        timer = window.setInterval(() => {
          if (!render(deadline) && timer !== undefined) {
            window.clearInterval(timer);
            timer = undefined;
          }
        }, 1000);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!state) return null;

  return (
    // pointer-events-none keeps the pill from swallowing clicks meant for the
    // hero underneath; the trade-off is that its text cannot be selected.
    <div className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center px-4 sm:top-auto sm:bottom-5 sm:justify-end sm:pr-6">
      <p
        role="timer"
        className="rounded-full border border-white/10 bg-void-900/85 px-4 py-2 text-xs font-medium text-bone-200 shadow-slab backdrop-blur-md"
      >
        {state.closed ? (
          state.label
        ) : (
          <>
            Registration closes in <span className="font-semibold tabular-nums text-bone-50">{state.label}</span>
          </>
        )}
      </p>
    </div>
  );
}