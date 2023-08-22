import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        handwriting: 'Allison',
        sans: ['Inter Variable', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
} satisfies Config

