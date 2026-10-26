import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        ink: "#0B0B14",
        panel: "#121224",
        "panel-2": "#0E0E1C",
        line: "rgba(148, 163, 184, 0.12)",
        cyan: { brand: "#0EE6FA", glow: "#00F0FF" },
        neon: { pink: "#FC3199", red: "#FF0844" },
        engine: { muse: "#00F0FF", flow: "#A855F7", seedance: "#EAB308", dola: "#EC4899" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #00F0FF 0%, #FC3199 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(0,240,255,0.16) 0%, rgba(252,49,153,0.14) 100%)",
        "grid-pattern":
          "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(0,240,255,0.45), 0 0 48px -12px rgba(252,49,153,0.55)",
        "glow-sm": "0 0 14px -4px rgba(0,240,255,0.5)",
        "glow-pink": "0 0 28px -6px rgba(252,49,153,0.6)",
        panel: "0 0 0 1px rgba(0,240,255,0.1), 0 20px 50px -20px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "gradient-x": "gradient-x 6s ease infinite",
        shimmer: "shimmer 2.2s infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
