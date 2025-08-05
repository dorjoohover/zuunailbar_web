import { colors, heroui } from "@heroui/theme";
import { color } from "framer-motion";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "diagonal-fade": "linear-gradient(55deg, #202020 20%, rgba(0,0,0,0) 80%)",
      },
      colors: {
        primary: {
          DEFAULT: "#ffeaec",
          pink: "#ffb3b8",
        },
        dark: {
          100: "#6f7675",
          200: "#3a3a3a",
          DEFAULT: "#191919",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    function ({ addUtilities }) {
      addUtilities({
        ".mask-image-custom": {
          "-webkit-mask-image": "url('/masks/image-mask.svg')",
          "-webkit-mask-repeat": "no-repeat",
          "-webkit-mask-size": "cover",
          "mask-image": "url('/masks/image-mask.svg')",
          "mask-repeat": "no-repeat",
          "mask-size": "cover",
        },
      });
    },
  ],
};

module.exports = config;
