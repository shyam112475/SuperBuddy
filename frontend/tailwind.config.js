/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f3',
          100: '#fce8e6',
          500: '#e8604c',
          600: '#d64a35',
          700: '#b33a29',
        },
      },
    },
  },
  plugins: [],
};
