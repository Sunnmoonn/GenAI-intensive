import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1C3D5E',
          50: '#EBF2FA',
          100: '#C8DDEF',
          600: '#1C3D5E',
          700: '#152E48',
        },
        surface: '#FFFFFF',
        bg: '#F5F5F3',
        border: '#E2E8F0',
        text: {
          1: '#0F172A',
          2: '#64748B',
          3: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
}
export default config
