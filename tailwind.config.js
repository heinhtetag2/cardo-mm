/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
          higher: 'rgb(var(--surface-higher) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--line) / <alpha-value>)',
          strong: 'rgb(var(--line-strong) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          dim: 'rgb(var(--ink-dim) / <alpha-value>)',
        },
        active: 'rgb(var(--active-bg) / <alpha-value>)',
        brand: {
          DEFAULT: '#5B8DEF',
          violet: '#8B5CF6',
          glow: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #5B8DEF 0%, #8B5CF6 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(91,141,239,0.08) 0%, rgba(91,141,239,0) 100%)',
        'glow-radial': 'radial-gradient(60% 50% at 50% 0%, rgba(91,141,239,0.18) 0%, rgba(91,141,239,0) 100%)',
        'hero-card': 'linear-gradient(135deg, var(--hero-from) 0%, var(--hero-via) 50%, var(--hero-to) 100%)',
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(0,0,0,0.3)',
        'glow': '0 0 40px rgba(91,141,239,0.25)',
      },
      animation: {
        'fade-in':       'fadeIn 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up':      'slideUp 340ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in':      'slideIn 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':      'scaleIn 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pop-in':        'popIn 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        popIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
