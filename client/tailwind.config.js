/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./tailwind.arcane.js")],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  plugins: [],
  theme: {
    extend: {
      // The default scale skips these steps, so `bg-void-900/85` or
      // `bg-sling-500/15` would be dropped silently. server/tailwind.config.js
      // declares the same two, which keeps the React app and the Go-rendered
      // templates on one scale.
      opacity: { 15: "0.15", 85: "0.85" },
    },
  },
};
