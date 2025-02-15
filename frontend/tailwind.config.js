/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        almarai: ['Almarai', 'sans-serif'],
        baloo: ['Baloo Bhaijaan 2', 'serif'],
        ibmplex: ['IBM Plex Sans Arabic', 'sans-serif'],
        lemonada: ['Lemonada', 'cursive'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
    },

  },
  plugins: [],
}
