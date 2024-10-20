/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6)', // Adjust colors as needed
      },
      animation: {
        bounce: 'bounce 1s infinite', // Add this if you want a bounce effect
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

