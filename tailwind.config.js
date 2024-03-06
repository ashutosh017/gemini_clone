/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          500: "#2d3b2d", // Adjust the hex code as needed
        },
      },
    },
  },
  plugins: [],
};
