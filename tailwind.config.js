/** @type {import('tailwindcss').Config} */
const { COLORS } = require("./src/constants/colors.ts");
const { FONTNAME } = require("./src/constants/fonts.ts");
const { SCREENS } = require("./src/constants/screens.ts");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: SCREENS,
    extend: {
      colors: COLORS,
      fontFamily: {
        openSans: [FONTNAME.OPENSANS_REGULAR, "system-ui", "sans-serif"],
        openSansItalic: [FONTNAME.OPENSANS_ITALIC, "system-ui", "sans-serif"],
        openSansLight: [FONTNAME.OPENSANS_LIGHT, "system-ui", "sans-serif"],
        openSansSemiBold: [
          FONTNAME.OPENSANS_SEMI_BOLD,
          "system-ui",
          "sans-serif",
        ],
        openSansCondensed: [
          FONTNAME.OPENSANS_CONDENSED_REGULAR,
          "system-ui",
          "sans-serif",
        ],
        openSansSemiCondensed: [
          FONTNAME.OPENSANS_SEMI_CONDENSED_REGULAR,
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
