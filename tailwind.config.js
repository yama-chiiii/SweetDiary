/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hachi Maru Pop', 'sans-serif'],
      },
      colors: {
        pink: {
          light: '#FADADD',
          DEFAULT: '#F7A8A8',
        },
      },
    },
  },
  plugins: [],
}
