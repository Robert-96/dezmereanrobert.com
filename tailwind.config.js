/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./themes/**/*.{html,js}'],
  darkMode: 'selector',
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
