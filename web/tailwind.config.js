/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: '#0C2630',
          800: '#123B4A', // Deep Ocean
          700: '#105F5A', // Dark Teal
          600: '#168C83', // Aqua Teal
          500: '#1AA59B',
          400: '#43C2B8',
          100: '#DDF3EC', // Seafoam
          50: '#F2FAF7',
        },
        mint: '#A9DCC8',
        sand: '#F5F1E8',
        aquaSuccess: '#24845B',
        aquaWarning: '#D99A38',
        aquaDanger: '#D96C64',
        aquaNeutral: '#64748B',
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'Gautami', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Mangal', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(18, 59, 74, 0.05), 0 1px 2px rgba(18, 59, 74, 0.03)',
        'card': '0 4px 12px -2px rgba(18, 59, 74, 0.08), 0 2px 6px -1px rgba(18, 59, 74, 0.04)',
        'floating': '0 12px 28px -4px rgba(18, 59, 74, 0.12), 0 4px 12px -2px rgba(18, 59, 74, 0.08)',
      },
    },
  },
  plugins: [],
}
