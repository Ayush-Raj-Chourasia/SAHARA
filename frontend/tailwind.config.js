/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sahara-orange': '#EA580C',
        'dark-bg': '#0E0E0D',
        'light-bg': '#F5F4F0',
      },
    },
  },
  plugins: [],
}
