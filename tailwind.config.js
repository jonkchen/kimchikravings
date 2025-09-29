/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
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
        // Apple liquid glass colors
        'glass': {
          'white': 'rgba(255, 255, 255, 0.1)',
          'black': 'rgba(0, 0, 0, 0.1)',
          'border': 'rgba(255, 255, 255, 0.2)',
          'border-dark': 'rgba(255, 255, 255, 0.1)',
        },
        'dark': {
          'bg': '#0a0a0a',
          'surface': '#1a1a1a',
          'surface-elevated': '#2a2a2a',
          'text': '#ffffff',
          'text-muted': '#a0a0a0',
          'border': '#333333',
        }
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'liquid': 'liquid 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 255, 255, 0.2)' },
        },
        liquid: {
          '0%, 100%': { borderRadius: '20px 40px 20px 40px' },
          '50%': { borderRadius: '40px 20px 40px 20px' },
        }
      }
    },
  },
  plugins: [],
}
