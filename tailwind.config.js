/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        zentry:["zentry", "sanf-seriff"],
        general: ["general", "sanf-seriff"],
        "circular-web": ["circular-web", "sanf-seriff"],
        "robert-regular": ["robert-regular", "sanf-seriff"],
        "robert-medium": ["robert-medium", "sanf-seriff"]

      }
    },
  },
  plugins: [],
}

