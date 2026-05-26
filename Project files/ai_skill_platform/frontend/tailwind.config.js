// Tailwind CSS Configuration
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0066CC',
          secondary: '#00A4EF',
          accent: '#FFB900',
        }
      }
    },
  },
  plugins: [],
}
