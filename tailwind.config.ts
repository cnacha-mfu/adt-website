import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // All colors reference CSS variables — values swap per theme
        void:    'rgb(var(--void-rgb) / <alpha-value>)',
        deep:    'rgb(var(--deep-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        card:    'rgb(var(--card-rgb) / <alpha-value>)',
        border:  'rgb(var(--border-rgb) / <alpha-value>)',
        teal: {
          DEFAULT: 'rgb(var(--teal-rgb) / <alpha-value>)',
          bright:  'rgb(var(--teal-bright-rgb) / <alpha-value>)',
          muted:   'rgb(var(--teal-muted-rgb) / <alpha-value>)',
          glow:    'rgb(var(--teal-rgb) / 0.15)',
        },
        gold: {
          DEFAULT: 'rgb(var(--gold-rgb) / <alpha-value>)',
          light:   'rgb(var(--gold-light-rgb) / <alpha-value>)',
          muted:   'rgb(var(--gold-muted-rgb) / <alpha-value>)',
          glow:    'rgb(var(--gold-rgb) / 0.15)',
        },
        ink: {
          primary:   'rgb(var(--ink-primary-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--ink-secondary-rgb) / <alpha-value>)',
          muted:     'rgb(var(--ink-muted-rgb) / <alpha-value>)',
          faint:     'rgb(var(--ink-faint-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        bebas:  ['var(--font-bebas)', 'var(--font-prompt)', 'sans-serif'],
        syne:   ['var(--font-syne)',  'var(--font-prompt)', 'sans-serif'],
        dm:     ['var(--font-dm)',    'var(--font-prompt)', 'sans-serif'],
        prompt: ['var(--font-prompt)', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-left': 'slideLeft 40s linear infinite',
        'grid-move':  'gridMove 8s linear infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        glowPulse: { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        slideLeft: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        gridMove:  { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(40px)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        float:     { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, rgb(var(--teal-rgb)) 0%, rgb(var(--teal-bright-rgb)) 100%)',
        'gold-gradient': 'linear-gradient(135deg, rgb(var(--gold-rgb)) 0%, rgb(var(--gold-light-rgb)) 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 20% 50%, rgb(var(--teal-rgb) / 0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgb(var(--gold-rgb) / 0.06) 0%, transparent 50%)',
      },
      boxShadow: {
        'teal-glow':  '0 0 24px rgb(var(--teal-rgb) / 0.25), 0 0 48px rgb(var(--teal-rgb) / 0.1)',
        'gold-glow':  '0 0 24px rgb(var(--gold-rgb) / 0.25), 0 0 48px rgb(var(--gold-rgb) / 0.1)',
        'card-hover': '0 12px 32px rgb(var(--ink-primary-rgb) / 0.12), 0 0 0 1px rgb(var(--teal-rgb) / 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
