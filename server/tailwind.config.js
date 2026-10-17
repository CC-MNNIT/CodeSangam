/**
 * Tailwind config for the Go-rendered pages (login + dashboard).
 * Shares the "Multiverse of Madness" preset with the React client, so both
 * surfaces draw from the same palette, type, motion and utilities.
 *
 * Build:  npm --prefix ../client run build:server-css
 */
module.exports = {
  presets: [require("../client/tailwind.arcane.js")],
  content: {
    // Resolve globs against this file, not the shell's working directory.
    relative: true,
    // dashboard.js toggles classes by name, so it has to be scanned too.
    files: ["./web/templates/*.html", "./web/static/js/*.js"],
  },
  theme: {
    extend: {
      // The default scale skips these steps, so `bg-sling-500/15` would be dropped.
      opacity: { 15: "0.15", 85: "0.85" },
      animation: {
        // A quicker entrance for dashboard panels as they are switched in.
        "panel-in": "rise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
};
