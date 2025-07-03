// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        avant: {
          primary: '#02B381',    // Verde Avantsoft
          secondary: '#00A2FF',  // Azul Avantsoft
          dark: '#101820',       // Preto/azul escuro do menu
        },
      },
    },
  },
  plugins: [],
}
