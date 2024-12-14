/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // add this line
  ],
  theme: {
    extend: {},
    colors:{
      PrimaryColor: "#202433",
      SecondaryColor: "#FC728B"
    }
  },
  plugins: [],
}