/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#ec4899',
        dark: '#0a0a0f'
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif']
      }
    }
  },
  plugins: []
};
