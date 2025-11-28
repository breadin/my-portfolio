// Use the dedicated PostCSS integration for Tailwind CSS
// See: https://tailwindcss.com/docs/integration-with-build-tools#postcss
module.exports = {
  plugins: [
    require("@tailwindcss/postcss")(),
    require("autoprefixer")()
  ]
};

