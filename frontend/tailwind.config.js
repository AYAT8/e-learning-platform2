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
        arabic: ["arabic" , "sans-serif"],
      },
      colors: {
        'custom-green': '#7DD658', // Ajoutez votre couleur ici
        'custom-blue': '#008feb',
        'custom-gray': '#f7fafa',
        'custom-blue2': '#29337E',
      },
    },
    

  },
  plugins: [],
}
