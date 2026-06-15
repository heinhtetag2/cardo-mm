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
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          violet: 'rgb(var(--brand-2) / <alpha-value>)',
          glow: 'rgb(var(--brand) / <alpha-value>)',
        },
        sand: {
          0:  '#ffffff',
          10: '#f8f7f7',
          20: '#ebebea',
          30: '#d8d6d4',
          40: '#b0adab',
          50: '#77736e',
          60: '#585450',
          70: '#3f3c39',
          80: '#2b2926',
          90: '#000000',
        },
      },
      fontFamily: {
        sans: ['"General Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"General Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, rgb(var(--brand)) 0%, rgb(var(--brand-2)) 100%)',
        'card-gradient': 'linear-gradient(180deg, rgb(var(--brand) / 0.08) 0%, rgb(var(--brand) / 0) 100%)',
        'glow-radial': 'radial-gradient(60% 50% at 50% 0%, rgb(var(--brand) / 0.18) 0%, rgb(var(--brand) / 0) 100%)',
        'hero-card': 'linear-gradient(135deg, var(--hero-from) 0%, var(--hero-via) 50%, var(--hero-to) 100%)',
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(0,0,0,0.3)',
        'glow': '0 0 40px rgb(var(--brand) / 0.25)',
      },
      animation: {
        'fade-in':       'fadeIn 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up':      'slideUp 340ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in':      'slideIn 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':      'scaleIn 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pop-in':        'popIn 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'flow-right':    'flowRight 2.4s ease-in-out infinite',
        'flow-left':     'flowLeft 2.4s ease-in-out infinite 1.2s',
        'soft-pulse':    'softPulse 2.6s ease-in-out infinite',
        'spin-slow':     'spin 12s linear infinite',
        'spin-rev':      'spin 8s linear infinite reverse',
        'progress-fill': 'progressFill 1800ms cubic-bezier(0.45, 0, 0.15, 1) forwards',
        'float-a':       'floatA 3.6s ease-in-out infinite',
        'float-b':       'floatB 4.2s ease-in-out infinite 0.6s',
        'float-c':       'floatC 4.8s ease-in-out infinite 1.2s',
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
        flowRight: {
          '0%':   { transform: 'translateX(-46px) scale(0.6)', opacity: '0' },
          '15%':  { transform: 'translateX(-30px) scale(1)',   opacity: '1' },
          '85%':  { transform: 'translateX(30px) scale(1)',    opacity: '1' },
          '100%': { transform: 'translateX(46px) scale(0.6)',  opacity: '0' },
        },
        flowLeft: {
          '0%':   { transform: 'translateX(46px) scale(0.6)',  opacity: '0' },
          '15%':  { transform: 'translateX(30px) scale(1)',    opacity: '1' },
          '85%':  { transform: 'translateX(-30px) scale(1)',   opacity: '1' },
          '100%': { transform: 'translateX(-46px) scale(0.6)', opacity: '0' },
        },
        softPulse: {
          '0%, 100%': { transform: 'scale(1)',    opacity: '0.65' },
          '50%':      { transform: 'scale(1.18)', opacity: '0.35' },
        },
        progressFill: {
          '0%':   { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        floatA: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)',     opacity: '0.4' },
          '50%':      { transform: 'translate(8px, -10px) scale(1.3)', opacity: '1' },
        },
        floatB: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)',      opacity: '0.5' },
          '50%':      { transform: 'translate(-6px, -8px) scale(1.4)', opacity: '1' },
        },
        floatC: {
          '0%, 100%': { transform: 'translate(0, 0) scale(0.9)',    opacity: '0.3' },
          '50%':      { transform: 'translate(5px, 6px) scale(1.2)',  opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
}
