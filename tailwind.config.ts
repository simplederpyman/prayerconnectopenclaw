import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFFBF5',
        foreground: '#2D2A32',
        border: '#E9DCC8',
        primary: {
          DEFAULT: '#6B46C1',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#D69E2E',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#63B3ED',
          foreground: '#102A43',
        },
        muted: '#F6EFE6',
        card: '#FFFFFF',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(107, 70, 193, 0.10)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgba(107,70,193,0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(214,158,46,0.14), transparent 30%)',
      },
    },
  },
  plugins: [],
} satisfies Config
