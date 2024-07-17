/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      monsterratBold:['Montserrat-Bold'],
      montserratSemiBold:['Montserrat-SemiBold'],
    },
    extend: {
      backgroundImage:{
        'sample-bg': "url('./public/sample.jpg')",
      }
    },
  },
  plugins: [],
}

