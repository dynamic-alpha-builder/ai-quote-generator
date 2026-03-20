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
        brand: {
          dark: '#1a1a1a',
          card: '#2a2a2a',
          border: '#333333',
        },
        accent: {
          purple: '#8b5cf6',
          'purple-light': '#a855f7',
        },
      },
    },
  },
  plugins: [],
}

export default config
