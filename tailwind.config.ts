import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "catalog-intro": {
          "0%": { opacity: "0", transform: "scale(0.98) translateZ(0)" },
          "100%": { opacity: "1", transform: "scale(1) translateZ(0)" },
        },
        "product-enter": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.97)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "page-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "splash-logo": {
          "0%": { opacity: "0", transform: "scale(0.88) translateZ(0)" },
          "100%": { opacity: "1", transform: "scale(1) translateZ(0)" },
        },
        "splash-cta": {
          "0%": { opacity: "0", transform: "translateY(12px) translateZ(0)" },
          "100%": { opacity: "1", transform: "translateY(0) translateZ(0)" },
        },
      },
      animation: {
        "catalog-intro": "catalog-intro 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "product-enter": "product-enter 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "page-fade": "page-fade 0.6s ease-out forwards",
        "splash-logo": "splash-logo 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "splash-cta": "splash-cta 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.35s forwards",
      },
      animationDelay: {
        "80": "80ms",
        "160": "160ms",
        "240": "240ms",
        "320": "320ms",
        "400": "400ms",
        "480": "480ms",
        "560": "560ms",
        "640": "640ms",
      },
      boxShadow: {
        "tylo-glow": "0 0 24px -4px rgba(13, 92, 92, 0.25)",
        "tylo-glow-lg": "0 0 32px -4px rgba(13, 92, 92, 0.3)",
      },
      colors: {
        tylo: {
          teal: "#0d5c5c",
          "teal-light": "#0f6e6e",
          "teal-dark": "#094848",
          cream: "#faf8f5",
          text: "#1a1a1a",
          "text-dark": "#1a1a1a",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
