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
        ink: "#0B0F19",
        panel: "#111827",
        "panel-2": "#0F1523",
        line: "rgba(148, 163, 184, 0.12)",
        cyan: { brand: "#06B6D4", glow: "#00F2FE" },
        neon: { pink: "#EC4899", red: "#FF0844" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #00F2FE 0%, #06B6D4 30%, #EC4899 75%, #FF0844 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(236,72,153,0.14) 100%)",
        "grid-pattern":
          "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(0,242,254,0.45), 0 0 48px -12px rgba(236,72,153,0.55)",
        "glow-sm": "0 0 14px -4px rgba(0,242,254,0.5)",
        "glow-pink": "0 0 28px -6px rgba(236,72,153,0.6)",
        panel: "0 0 0 1px rgba(6,182,212,0.12), 0 20px 50px -20px rgba(0,0,0,0.8)",
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
