/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Cblack: '#272932',
        Cblue: '#01BAEF',
        Cdarkblue: '#0B4F6C',
      }
    },
  },
  plugins: [],
}
