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

      },
      colors: {
        blue:{
          50: "#DFDFF0",
          75: "DFDFF2",
          100:"F0F2FA",
          200: "#010101",
          300: "#4FB7DD"

        },
        violet: {
          300: "#5724FF"
        },
        yellow: {
          100: "#8E983F",
          300: "#EDFF66"
        }
      }
    },
  },
  plugins: [],
}

