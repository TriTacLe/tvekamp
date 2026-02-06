import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        web: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
        },
        devops: {
          primary: '#f97316',
          secondary: '#22c55e',
        },
        bg: {
          dark: '#0f0f1a',
          card: '#1a1a2e',
        },
      },
      fontFamily: {
        display: ['var(--font-bangers)'],
        body: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [],
};

export default config;
