// tailwind.config.ts
import type { Config } from 'tailwindcss'
import { colors, fontSize, spacing, borderRadius, shadows } from './src/utils/theme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontSize,
      spacing,
      borderRadius,
      boxShadow: shadows,
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
