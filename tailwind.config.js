/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0a0b0d',
          900: '#0f1115',
          850: '#14171c',
          800: '#1a1e24',
          700: '#242933',
          600: '#2f3540',
        },
        lime: {
          glow: '#c6ff00',
          neon: '#aaff00',
          soft: '#d7ff57',
          deep: '#7fae00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(198, 255, 0, 0.25)',
        'glow-md': '0 0 24px rgba(198, 255, 0, 0.30)',
        'glow-lg': '0 0 48px rgba(198, 255, 0, 0.22)',
        panel: '0 8px 40px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'metal-gradient':
          'linear-gradient(145deg, rgba(47,53,64,0.9) 0%, rgba(20,23,28,0.9) 60%, rgba(10,11,13,0.95) 100%)',
        'lime-sheen':
          'linear-gradient(135deg, rgba(198,255,0,0.12) 0%, rgba(198,255,0,0) 55%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
