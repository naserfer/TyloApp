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
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
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
      },
      animation: {
        "catalog-intro": "catalog-intro 0.7s ease-out forwards",
        "product-enter": "product-enter 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "page-fade": "page-fade 0.6s ease-out forwards",
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
