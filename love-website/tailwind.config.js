/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ["Cormorant Garamond", "serif"],
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        rose: {
          blush: "#fff0f3",
          deep: "#8b1a3a",
          medium: "#c0506a",
          soft: "#d48094",
          border: "#f5c0cc",
          petal1: "#ffb3c6",
          petal2: "#ff85a1",
          petal3: "#ff4d79",
          petal4: "#ffd6e0",
          petal5: "#ff8fa3",
        }
      },
      animation: {
        fall: "fall var(--duration, 12s) linear infinite",
        "pulse-down": "pulse-down 2s ease-in-out infinite",
      },
      keyframes: {
        fall: {
          "0%": { transform: "translateY(-60px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.7" },
          "90%": { opacity: "0.5" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
        "pulse-down": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(5px)", opacity: "1" },
        }
      }
    },
  },
  plugins: [],
}

