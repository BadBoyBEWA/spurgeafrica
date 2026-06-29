import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#0b0b0d",
        ink: "#141417",
        gold: "#d4a853",
        emerald: "#1a3c34",
        terracotta: "#c85a3f",
        cream: "#f4ecdd"
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
        display: ["Syne", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 70px rgba(212,168,83,.18)",
        soft: "0 28px 90px rgba(0,0,0,.32)"
      },
      animation: {
        marquee: "marquee 26s linear infinite",
        pulseCart: "pulseCart 1.4s ease-in-out"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        pulseCart: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.16)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
