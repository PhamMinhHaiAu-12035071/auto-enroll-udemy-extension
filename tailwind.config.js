/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/popup.html', './public/options.html'],
  theme: {
    extend: {
      fontFamily: {
        craft: ['Craft Rounded', 'sans-serif'],
        'craft-demi': ['Craft Rounded Demi', 'sans-serif'],
        'craft-cd': ['Craft Rounded Cd', 'sans-serif']
      }
    }
  },
  plugins: []
}
