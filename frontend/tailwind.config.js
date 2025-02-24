/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}", // Scans all JS and JSX files in the app directory
    "./components/**/*.{js,jsx}", // Scans components for Tailwind classes
    "./pages/**/*.{js,jsx}", // Scans pages for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
