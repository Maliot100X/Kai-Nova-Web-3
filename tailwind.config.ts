import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        gold: {
          DEFAULT: "#FFD700",
          dark: "#B8860B",
          light: "#FFE44D",
        },
        royal: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#FFD700",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        carbon: {
          DEFAULT: "#0a0a0a",
          50: "#1a1a1a",
          100: "#151515",
          200: "#111111",
          300: "#0d0d0d",
          400: "#0a0a0a",
          500: "#080808",
          600: "#050505",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FFD700, #B8860B, #FFE44D)",
        "obsidian-gradient": "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.02))",
      },
      boxShadow: {
        gold: "0 0 20px rgba(255, 215, 0, 0.15)",
        "gold-lg": "0 0 40px rgba(255, 215, 0, 0.2)",
        "gold-glow": "0 0 60px rgba(255, 215, 0, 0.3)",
      },
      animation: {
        "gold-pulse": "goldPulse 2s ease-in-out infinite",
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        goldPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 215, 0, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 215, 0, 0.3)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
