/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      textShadow: {
        '1': '0 -40px 100px rgba(0, 0, 0, 0.5)',
        '2': '0 0 2px rgba(0, 0, 0, 0.5)',
        '3': '0 0 1em #329ED6',
        '4': '0 0 0.5em #329ED6',
        '5': '0 0 0.1em #329ED6',
        '6': '0 10px 3px #000',
      },
      fontSize: {
        '15vh': '15vh',
      },
      fontFamily: {
        'comfortaa': ['Comfortaa', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-textshadow'),
  ],
}

