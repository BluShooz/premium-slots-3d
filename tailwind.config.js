/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#f9e27b',
          DEFAULT: '#d4af37',
          dark: '#9a7b0c',
        },
        casino: {
          red: '#c41e3a',
          black: '#1a1a1a',
          green: '#006400',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        casino: ['Luckiest Guy', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
