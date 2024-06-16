/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'none': 'none',
      },
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
    variants: {
      extend: {
    // 必要に応じてvariantsを拡張
      },
    },
  },
  plugins: [function ({ addUtilities }) {
    const newUtilities = {
      '.no-spin': {
        '-webkit-appearance': 'none',
        '-moz-appearance': 'textfield',
      },
      '.no-spin::-webkit-outer-spin-button, .no-spin::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
    };
    addUtilities(newUtilities, ['responsive', 'hover']);
  },],
}
