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
        pulse: {
          bg: '#000000',
          surface: '#0a0a0a',
          card: '#111111',
          border: 'rgba(255,255,255,0.06)',
          amber: '#F5C542',
          blue: '#4A9EFF',
          green: '#00C805',
          pink: '#FF6B8A',
          purple: '#A78BFA',
          gray: '#888888',
        },
        category: {
          m1: '#F5C542',
          m2: '#4A9EFF',
          m3: '#00C805',
          m4: '#FF6B8A',
          m5: '#A78BFA',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
      },
      animation: {
        'fade-up': 'fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
