/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"], 
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        royalblue: {
          50:  "#E6ECF4",
          100: "#CCD9EA",
          200: "#99B3D5",
          300: "#668CC0",
          400: "#3366AB",
          500: "#0A3476",  // default
          600: "#082C63",
          700: "#062350",
          800: "#041A3D",
          900: "#02122A",
          DEFAULT: "#0A3476"
        },
        goldenYellow: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#FACC15", // default
          600: "#EAB308",
          700: "#CA8A04",
          800: "#A16207",
          900: "#713F12",
          DEFAULT: "#FACC15",
        },
      },
    },
  },
  plugins: [],
}

