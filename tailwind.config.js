// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your JS/JSX/TS/TSX files in src
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(15, 23, 42, 0.08)',
        'soft-lg': '0 12px 40px -12px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
