import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
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
        sans: ["\"Be Vietnam Pro\"", "ui-sans-serif", "system-ui", "sans-serif"],
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
        "aurora-1": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(12vw,8vh,0) scale(1.15)" },
        },
        "aurora-2": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1.1)" },
          "50%": { transform: "translate3d(-10vw,12vh,0) scale(0.9)" },
        },
        "aurora-3": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(8vw,-10vh,0) scale(1.2)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0", transform: "translate3d(0,0,0) scale(0.6)" },
          "50%": { opacity: "0.9", transform: "translate3d(0,-24px,0) scale(1)" },
        },
        marquee: { from: { transform: "translate3d(0,0,0)" }, to: { transform: "translate3d(-100%,0,0)" } },
        "marquee-reverse": { from: { transform: "translate3d(-100%,0,0)" }, to: { transform: "translate3d(0,0,0)" } },
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-10px,0)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "60%, 100%": { transform: "translateX(220%) skewX(-20deg)" },
        },
        ping: {
          "75%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "beam-down": {
          "0%": { transform: "translate3d(0,-100%,0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translate3d(0,900%,0)", opacity: "0" },
        },
      },
      animation: {
        "gradient-x": "gradient-x 6s ease infinite",
        shimmer: "shimmer 2.2s infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "aurora-1": "aurora-1 22s ease-in-out infinite",
        "aurora-2": "aurora-2 26s ease-in-out infinite",
        "aurora-3": "aurora-3 30s ease-in-out infinite",
        twinkle: "twinkle 10s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        float: "float 5s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "spin-slower": "spin 22s linear infinite",
        shine: "shine 3.2s ease-in-out infinite",
        ping: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
        "beam-down": "beam-down 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
