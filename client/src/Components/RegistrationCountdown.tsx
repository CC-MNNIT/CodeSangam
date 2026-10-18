import { useEffect, useState } from "react";
import { route } from "../Utils/Config";

const pad = (n: number) => String(n).padStart(2, "0");

type DeadlineResponse = {
  deadline: number;
  passed: boolean;
  development_label: string;
};

/**
 * When registration closes, and when the development period runs.
 *
 * Both come from the server (GET /api/v1/cs/deadline) rather than being baked
 * in at build time, so moving a date is a server-side edit and a restart - no
 * rebuild, and the dates on screen can never disagree with what the server
 * actually enforces. The development window is formatted server-side in IST, so
 * there is no timezone maths here and no second copy of the dates to forget.
 *
 * If the request fails, or nothing is configured, this renders nothing at all.
 *
 * Fixed positioning keeps it out of the document flow, so it cannot disturb the
 * hero's pinned section. That does rely on no ancestor having a transform or
 * filter: the page wrapper only animates opacity, which is safe.
 */
export default function RegistrationCountdown() {
  const [state, setState] = useState<{ countdown: string | null; closed: boolean; development: string } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    let deadline = 0;
    let settled = false;

    // Returns true while there is still time to count down.
    const render = (until: number): boolean => {
      const left = until - Math.floor(Date.now() / 1000);
      if (cancelled) return false;
      if (left <= 0) {
        settled = true;
        setState((prev) => prev && { ...prev, countdown: null, closed: true });
        return false;
      }
      const days = Math.floor(left / 86400);
      const hours = Math.floor((left % 86400) / 3600);
      const mins = Math.floor((left % 3600) / 60);
      const secs = left % 60;
      const label = (days > 0 ? `${days}d ` : "") + `${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
      setState((prev) => prev && { ...prev, countdown: label, closed: false });
      return true;
    };

    // Background tabs throttle timers to about once a minute, so refresh the
    // value when the visitor comes back rather than showing a stale count.
    const onVisible = () => {
      if (!document.hidden && deadline && !settled) render(deadline);
    };
    document.addEventListener("visibilitychange", onVisible);

    fetch(route("api/v1/cs/deadline"), { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DeadlineResponse | null) => {
        if (!data || cancelled) return;
        const development = data.development_label || "";
        const hasDeadline = data.deadline > 0;
        if (!hasDeadline && !development) return;

        setState({ countdown: null, closed: false, development });
        if (!hasDeadline) return;

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
      if (timer !== undefined) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!state) return null;
  const showCountdown = state.countdown !== null || state.closed;

  return (
    // pointer-events-none keeps the pill from swallowing clicks meant for the
    // hero underneath; the trade-off is that its text cannot be selected.
    <div className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center px-4 sm:top-auto sm:bottom-5 sm:justify-end sm:pr-6">
      <div
        role="timer"
        className="rounded-3xl border border-white/10 bg-void-900/80 px-4 py-2 text-xs font-medium text-bone-200 shadow-slab backdrop-blur-md"
      >
        {showCountdown && (
          <p>
            {state.closed ? (
              "Registration is closed"
            ) : (
              <>
                Registration closes in{" "}
                <span className="font-semibold tabular-nums text-bone-50">{state.countdown}</span>
              </>
            )}
          </p>
        )}
        {state.development && <p className="mt-1 text-bone-300">{state.development}</p>}
      </div>
    </div>
  );
}
