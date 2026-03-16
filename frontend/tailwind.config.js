/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bank-primary': '#1e3a8a',
        'bank-secondary': '#3b82f6',
        'bank-accent': '#60a5fa',
        'fraud-high': '#dc2626',
        'fraud-medium': '#f59e0b',
        'fraud-low': '#10b981',
      },
    },
  },
  plugins: [],
}
