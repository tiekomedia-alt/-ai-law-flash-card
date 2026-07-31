import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a3b70',
        'primary-hover': '#163262',
        gold: '#c5a059',
        'gold-light': '#f1e0b5',
        'bg-light': '#f6f7f8',
        'bg-dark': '#13181f',
        'card-white': '#ffffff',
        'border-light': '#e2e8f0',
        'text-primary': '#0f172a',
        'text-muted': '#64748b',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10)',
        'primary': '0 4px 14px rgba(26,59,112,0.25)',
        'gold': '0 4px 14px rgba(197,160,89,0.25)',
      },
    },
  },
  plugins: [],
}

export default config
