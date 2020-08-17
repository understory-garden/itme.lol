module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#333',
      },
      fontFamily: {
        mono: ['covik-sans-mono', 'sans-serif'],
      },
    },
  },
  variants: {},
  plugins: [],
}
