/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        miruSpin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        sideTopToBottom: {
          'from': { transform: 'translateY(-12px)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 },
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}