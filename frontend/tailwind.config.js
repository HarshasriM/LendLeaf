// Simpler version (for plain JS projects)
const config =  {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "background":"#f3e8ff",
        "primary":"#c084fc",
        "secondary":"#9333ea"
      }
    },
  },
  plugins: [],
}
export default config;
