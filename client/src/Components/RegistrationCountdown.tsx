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
 * Positioned fixed so it can never disturb the hero's pinned scroll layout.
 */
export default function RegistrationCountdown() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const render = (deadline: number) => {
      const left = deadline - Math.floor(Date.now() / 1000);
      if (cancelled) return;
      if (left <= 0) {
        setLabel(null);
        return;
      }
      const days = Math.floor(left / 86400);
      const hours = Math.floor((left % 86400) / 3600);
      const mins = Math.floor((left % 3600) / 60);
      const secs = left % 60;
      setLabel((days > 0 ? `${days}d ` : "") + `${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`);
    };

    fetch(route("api/v1/cs/deadline"), { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DeadlineResponse | null) => {
        if (!data || !data.deadline || cancelled) return;
        render(data.deadline);
        timer = window.setInterval(() => render(data.deadline), 1000);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, []);

  if (!label) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 sm:justify-end sm:pr-6">
      <p className="rounded-full border border-white/10 bg-void-900/85 px-4 py-2 text-xs font-medium text-bone-200 shadow-slab backdrop-blur-md">
        Registration closes in{" "}
        <span className="font-semibold tabular-nums text-bone-50">{label}</span>
      </p>
    </div>
  );
}