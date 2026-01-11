/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        gold: {
          400: '#FBBF24', // Amber 400
          500: '#F59E0B', // Amber 500
          600: '#D97706', // Amber 600
        },
        dark: {
          900: '#0f0f0f',
          800: '#1a1a1a',
        }
      }
    },
  },
  plugins: [],
}
