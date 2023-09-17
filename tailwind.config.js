/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,js}", "./views/partials/**/*.ejs"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    extend: {
      colors: {
        gold: "#D4AF37",
        lightGray1: "#FDFDFD",
        darkGray: "#F1F8FF",
        brightBlue: "#0f2331",
        darkBlue: "#030346",
        lightPink: "#FEB7FE",
        lightGreen: "#4CAF50",
        darkerBlue: "#7F8487",
        lightGray: "#DCDCDC",
        orangeRed: "#FF4500",
        darkWhite: "#F2F4FB",
        veryDarkWhite: "#DDDDDD",
        paleGreen: "#84D2C5",
        darkerWhite: "#ECECEC",
        inkBlue: "#31286e",
        darkNavy: "#0f2331",
      },
    },
  },
  plugins: [],
};
