/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        busan: {
          primary: '#00f0ff',
          secondary: '#1d7eff',
          accent: '#68ffb3',
          dark: '#040b14',
          panel: 'rgba(10, 20, 35, 0.65)',
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
