/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2F5BFF', dark: '#1F3FCC', light: '#EAF0FF' },
        neutral: {
          base: '#FFFFFF',
          secondary: '#F5F7FB',
          border: '#E2E6EF',
          text: '#1A1F36',
          sub: '#5B6378',
          muted: '#9AA3B2',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: { sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'] },
      borderRadius: { card: '16px', btn: '10px' },
      boxShadow: { card: '0 4px 20px rgba(0,0,0,0.04)' },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      })
    },
  ],
}

