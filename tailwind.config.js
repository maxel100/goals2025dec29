/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        landing: {
          purple: {
            light: '#f5f3ff',
            DEFAULT: '#7c3aed'
          },
          blue: {
            light: '#eff6ff',
            DEFAULT: '#3b82f6'
          }
        }
      },
      backgroundImage: {
        'landing-gradient': 'linear-gradient(to right, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        'subtle-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
        'rocket-1': {
          '0%': { transform: 'translateY(100vh) rotate(45deg)' },
          '100%': { transform: 'translateY(-100vh) rotate(45deg)' }
        },
        'rocket-2': {
          '0%': { transform: 'translateY(100vh) rotate(45deg)' },
          '100%': { transform: 'translateY(-100vh) rotate(45deg)' }
        },
        'rocket-3': {
          '0%': { transform: 'translateY(100vh) rotate(45deg)' },
          '100%': { transform: 'translateY(-100vh) rotate(45deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translate(-25%, -25%)' },
          '50%': { transform: 'translate(-15%, -35%)' }
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translate(50%, -15%)' },
          '50%': { transform: 'translate(45%, -25%)' }
        },
        'circle-float': {
          '0%': {
            transform: 'translate(-50%, -50%) rotate(0deg) translateX(20px) rotate(0deg)',
          },
          '100%': {
            transform: 'translate(-50%, -50%) rotate(360deg) translateX(20px) rotate(-360deg)',
          },
        },
      },
      animation: {
        twinkle: 'twinkle 3s ease-in-out infinite',
        'subtle-pulse': 'subtle-pulse 3s ease-in-out infinite',
        'rocket-1': 'rocket-1 7s linear infinite',
        'rocket-2': 'rocket-2 8s linear infinite',
        'rocket-3': 'rocket-3 6s linear infinite',
        'float': 'float 20s ease-in-out infinite',
        'float-delayed': 'float-delayed 25s ease-in-out infinite',
        'circle-float': 'circle-float 20s linear infinite',
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter var', 'system-ui', 'sans-serif']
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
}