/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#1e40af',
          secondary: '#7c3aed',
          dark: '#0f172a',
          light: '#f1f5f9'
        }
      }
    },
  },
  plugins: [],
}
