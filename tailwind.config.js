/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        secondary: '#00B894',
        'primary-dark': '#5F4FD1',
        'secondary-dark': '#00A07D',
      },
    },
  },
  plugins: [],
}
