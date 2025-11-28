/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './docs/**/*.vue',
    './docs/**/*.md',
    './docs/**/*.ts',
    './docs/**/*.js',
    './docs/.vitepress/**/*',
    './src/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          400: '#ef7234'
        }
      }
    }
  },
  plugins: []
};
