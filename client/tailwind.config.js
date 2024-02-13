/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/**/**.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      rotate: {
        '225': '225deg',
      }
    },
  },
  plugins: [],
}

