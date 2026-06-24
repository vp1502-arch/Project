/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Unilever-inspired palette (verify against official brand kit).
        unilever: {
          blue: '#1F36C7',
          dark: '#142A86',
          cyan: '#00B5E2',
          green: '#3CB44B',
          surface: '#F5F7FB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
