/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emergency-red': '#c10007',
        'emergency-light': '#fef2f2',
        'success-green': '#00a63e',
        'info-blue': '#155dfc',
        'warning-orange': '#d08700',
        'ruby': {
          400: '#f87171',
          500: '#e0115f',
          600: '#dc2626',
        },
      }
    },
  },
  plugins: [],
}
