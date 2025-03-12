/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/popup.html', './public/options.html'],
  theme: {
    extend: {
      fontFamily: {
        craft: ['Craft Rounded', 'sans-serif'],
        'craft-demi': ['Craft Rounded Demi', 'sans-serif'],
        'craft-cd': ['Craft Rounded Cd', 'sans-serif']
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
        base: '#f2e6f7'
      }
    }
  },
  plugins: []
}
