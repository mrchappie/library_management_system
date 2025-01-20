import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'custom-shadow-color': 'rgba(255, 255, 255, 0.3)',
      },
      height: {
        'full-screen': 'calc(100vh - var(--navbar-height))',
      },
    },
  },
  plugins: [],
} satisfies Config;
