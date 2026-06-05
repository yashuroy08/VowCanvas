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
          blush: "var(--rose-blush)",
          deep: "var(--rose-deep)",
          medium: "var(--rose-medium)",
          soft: "var(--rose-soft)",
          border: "var(--rose-border)",
          dark: "var(--rose-dark)",
          "dark-accent": "var(--rose-dark-accent)",
          "medium-accent": "var(--rose-medium-accent)",
          "light-accent": "var(--rose-light-accent)",
          "grad-start": "var(--rose-gradient-start)",
          "grad-end": "var(--rose-gradient-end)",
          "muted": "var(--rose-text-muted)",
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

