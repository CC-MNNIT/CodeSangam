/**
 * CodeSangam design system — "Multiverse of Madness".
 *
 * One Tailwind preset shared by the React client (client/tailwind.config.js)
 * and the Go-served login/dashboard pages (server/tailwind.config.js), so every
 * surface draws from the same palette, type, motion and utilities.
 *
 * Colour language
 *   void      the dark between universes (near-black violet, never pure black)
 *   arcane    mystic violet — the Sanctum, the Mirror Dimension
 *   scarlet   Wanda's red / the Cloak — the Hall of Records
 *   sling     orange-gold sparks of the sling ring — primary action colour
 *   agamotto  Eye of Agamotto green — sparingly, for "live" and success
 *   ether     cold cyan of the other universes
 *   bone      violet-tinted off-white for text
 *   tint      the current universe's colour, set per surface via --tint
 */
const plugin = require("tailwindcss/plugin");

/** Noise tile used as a film-grain overlay. Static, so it is free to paint. */
const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

module.exports = {
  theme: {
    extend: {
      colors: {
        void: {
          950: "#05030a",
          900: "#0a0612",
          800: "#100a1c",
          700: "#190f2b",
          600: "#241640",
          500: "#33205a",
        },
        arcane: {
          200: "#ddd0ff",
          300: "#c4b2ff",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7340e8",
          700: "#5b27c2",
          800: "#3d1a85",
        },
        scarlet: {
          300: "#ff9aa6",
          400: "#f66b7d",
          500: "#e23b55",
          600: "#bd1f3c",
          700: "#841229",
        },
        sling: {
          200: "#ffe3b8",
          300: "#ffcf86",
          400: "#ffb347",
          500: "#ff8f1f",
          600: "#e5700a",
          700: "#a84d05",
        },
        agamotto: {
          300: "#8ff5c9",
          400: "#4eeaa8",
          500: "#25cf8f",
        },
        ether: {
          300: "#8fe0ff",
          400: "#4cc7f5",
          500: "#1fa7e0",
        },
        bone: {
          50: "#faf6ff",
          100: "#efe8fb",
          200: "#d6cbea",
          300: "#b3a6cf",
          400: "#8f82ad",
        },
        tint: "rgb(var(--tint) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Cinzel", '"Trajan Pro"', "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        rune: "0.24em",
        grand: "0.42em",
      },
      boxShadow: {
        // Depth always carries an offset: light falls from the portal above.
        portal:
          "0 18px 60px -12px rgb(var(--tint) / 0.45), 0 2px 0 0 rgb(255 255 255 / 0.06) inset",
        ring: "0 10px 40px -10px rgb(255 143 31 / 0.55)",
        slab: "0 30px 80px -30px rgb(0 0 0 / 0.9), 0 1px 0 0 rgb(255 255 255 / 0.05) inset",
      },
      backgroundImage: {
        grain,
        "void-wash":
          "radial-gradient(120% 80% at 50% -10%, #2a1456 0%, #12091f 45%, #05030a 80%)",
        "sling-edge":
          "conic-gradient(from 0deg, rgb(255 143 31 / 0), rgb(255 179 71) 18%, rgb(255 143 31 / 0) 40%, rgb(255 143 31 / 0) 100%)",
        "tint-edge":
          "conic-gradient(from 0deg, rgb(var(--tint) / 0), rgb(var(--tint)) 18%, rgb(var(--tint) / 0) 40%, rgb(var(--tint) / 0) 100%)",
      },
      keyframes: {
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "spin-rev": { to: { transform: "rotate(-360deg)" } },
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-14px,0)" },
        },
        breathe: {
          "0%,100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "46%": { opacity: "1" },
          "48%": { opacity: "0.35" },
          "50%": { opacity: "1" },
          "54%": { opacity: "0.6" },
          "56%": { opacity: "1" },
        },
        rise: {
          from: { opacity: "0", transform: "translate3d(0,22px,0)" },
          to: { opacity: "1", transform: "translate3d(0,0,0)" },
        },
        "portal-open": {
          from: { opacity: "0", transform: "scale(0.6) rotate(-24deg)" },
          to: { opacity: "1", transform: "scale(1) rotate(0)" },
        },
        "dash-run": { to: { strokeDashoffset: "-400" } },
        // Opacity only: a transform here would trap the page's fixed elements.
        "page-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "line-down": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "50%": { transform: "scaleY(1)", transformOrigin: "top" },
          "51%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 60s linear infinite",
        "spin-medium": "spin-slow 28s linear infinite",
        "spin-fast": "spin-slow 12s linear infinite",
        "spin-rev": "spin-rev 44s linear infinite",
        "spin-rev-fast": "spin-rev 18s linear infinite",
        drift: "drift 7s ease-in-out infinite",
        breathe: "breathe 5s ease-in-out infinite",
        flicker: "flicker 6s linear infinite",
        rise: "rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "portal-open": "portal-open 1.1s cubic-bezier(0.16, 1, 0.3, 1) both",
        "dash-run": "dash-run 9s linear infinite",
        "page-in": "page-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "line-down": "line-down 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
      },
      transitionTimingFunction: {
        // Exponential ease-out: fast departure, long settle.
        arcane: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, addComponents, matchUtilities, theme }) {
      addUtilities({
        // SVG children rotate around their own centre, not the viewBox origin.
        ".svg-box": { "transform-box": "fill-box", "transform-origin": "center" },
        ".scrollbar-none": { "scrollbar-width": "none" },
        ".scrollbar-none::-webkit-scrollbar": { display: "none" },
        ".text-glow": {
          "text-shadow":
            "0 6px 34px rgb(var(--tint) / 0.55), 0 1px 0 rgb(255 255 255 / 0.12)",
        },
        ".will-parallax": { "will-change": "transform" },
        ".pointer-events-children": { "pointer-events": "none" },
        ".pointer-events-children > *": { "pointer-events": "auto" },
      });

      // `tint-<r>-<g>-<b>` style helper is awkward; expose --tint by name.
      matchUtilities(
        { "universe": (value) => ({ "--tint": value }) },
        {
          values: {
            sanctum: "255 143 31",
            library: "139 92 246",
            scarlet: "244 63 94",
            ether: "76 199 245",
            agamotto: "78 234 168",
            void: "148 163 184",
          },
        }
      );

      addComponents({
        // Visible, themed keyboard focus for every interactive element.
        ".focus-ring": {
          "&:focus-visible": {
            outline: "2px solid " + theme("colors.sling.400"),
            "outline-offset": "3px",
          },
        },
      });
    }),
  ],
};
