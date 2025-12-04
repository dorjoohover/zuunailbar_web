import { colors, heroui } from "@heroui/theme";
import { color } from "framer-motion";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px", // extra small
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px", // custom large
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "diagonal-fade":
          "linear-gradient(55deg, #202020 20%, rgba(0,0,0,0) 80%)",
        "text-gradient":
          "linear-gradient(to right, #5330f1 12.31%, #c585d8 31.82%, #fa4b9a 55.82%, #ff8c6c 74.32%, #ff3800 95.82%)",
      },
      accent: {
        DEFAULT: "#E11D48",
        foreground: "",
      },
      // rose: {
      //   50: "oklch(0.98 0.01 350)", //backgrounds
      //   100: "oklch(0.96 0.02 350)", //borders
      //   400: "#FB7185", //gradients,  buttons
      //   500: "#F43F5E", // hover states
      //   600: "#E11D48", // text accents
      //   900: "#881337", //headings
      // },
      background: {
        DEFAULT: "#FCFAF6",
        foreground: "#24211C",
      },
      card: {
        DEFAULT: "#FDFCF9",
        foreground: "#24211C",
      },
      popover: {
        DEFAULT: "#FDFCF9",
        foreground: "#24211C",
      },
      primary: {
        DEFAULT: "#7E423E",
        foreground: "#FDFCF9",
      },
      secondary: {
        DEFAULT: "#EAE4DA",
        foreground: "#403A2F",
      },
      muted: {
        DEFAULT: "#F2EEE9",
        foreground: "#66635D",
      },
      accent: {
        DEFAULT: "#EBD2C6",
        foreground: "#26201D",
      },
      destructive: {
        DEFAULT: "#C83542",
        foreground: "#FCFCFC",
      },
      border: {
        DEFAULT: "#E2DDD7",
        foreground: "#24211C", // хэрвээ foreground байхгүй бол DEFAULT-гээ ашиглаж болно
      },
      input: {
        DEFAULT: "#F2EEE9",
        foreground: "#24211C",
      },
      ring: {
        DEFAULT: "#7E423E",
        foreground: "#FDFCF9",
      },
      sidebar: {
        DEFAULT: "#FCFAF6",
        foreground: "#24211C",
        primary: "#7E423E",
        "primary-foreground": "#FDFCF9",
        accent: "#EAE4DA",
        "accent-foreground": "#403A2F",
        border: "#E2DDD7",
        "border-foreground": "#24211C",
        ring: "#7E423E",
        "ring-foreground": "#FDFCF9",
      },
      booking: {
        cream: "#F7F1EB",
        "cream-foreground": "#24211C",
        beige: "#E3D5CA",
        "beige-foreground": "#24211C",
        brown: "#49362D",
        "brown-foreground": "#FDFCF9",
        gold: "#CAAA73",
        "gold-foreground": "#24211C",
        rose: "#EAB5B7",
        "rose-foreground": "#24211C",
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
