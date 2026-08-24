import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spotBlue: {
          DEFAULT: '#4787F2',
          hover: '#3373E0',
          dark: '#1D53B8',
          light: '#EDF4FF',
          subtle: '#F4F8FF',
        },
        festivalYellow: {
          DEFAULT: '#F2B604',
          hover: '#DEA400',
          light: '#FFF8E6',
        },
        trustGreen: {
          DEFAULT: '#35AB4E',
          hover: '#2A9641',
          light: '#EBF9EE',
        },
        deepCrimson: {
          DEFAULT: '#981837',
          hover: '#82102C',
          light: '#FBECEF',
        },
        ink: {
          DEFAULT: '#17181C',
          secondary: '#4A5260',
          muted: '#687182',
          light: '#9AA4B2',
          subtle: '#CDD5DF',
        },
        canvas: '#F4F6FB',
        border: '#E3E8EF',
      },
      borderRadius: {
        avatar: '12px',
        card: '16px',
        modal: '20px',
        pill: '9999px',
      },
      fontFamily: {
        heading: ['var(--font-jakarta)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(16, 24, 40, 0.06), 0 1px 4px -1px rgba(16, 24, 40, 0.04)',
        cardHover: '0 12px 24px -6px rgba(16, 24, 40, 0.08), 0 4px 8px -2px rgba(16, 24, 40, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
