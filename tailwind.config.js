/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./*.html", // Adjust path as necessary
    "./src/**/*.{html,js}" // Include paths where you have HTML and JavaScript files
  ],
  theme: {
    extend: {
      colors: {
        'card_bg': '#f3f6f4',
      },
    },
  },
  plugins: [],
}

