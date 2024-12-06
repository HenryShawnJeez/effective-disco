/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,js}", "./views/partials/**/*.ejs"],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      "2xl": "1400px",
    },
    extend: {
      colors: {
        gold: "#E5C100",
        lightGray1: "#FAFAFA",
        darkGray: "#D9E2F3",
        brightBlue: "#1E293B",
        darkBlue: "#1A237E",
        lightGreen: "#66BB6A",
        darkerBlue: "#374151",
        lightGray: "#E5E5E5",
        orangeRed: "#FF5722",
        darkWhite: "#F3F4F6",
        veryDarkWhite: "#E2E2E2",
        paleGreen: "#A7DAD8",
        darkerWhite: "#F5F5F5",
        inkBlue: "#3A3A8A",
        darkNavy: "#1C1C44",
      },      
    },
  },
  plugins: [],
};
