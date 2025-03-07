import formsPlugin from '@tailwindcss/forms';
import aspectRatioPlugin from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    formsPlugin,
    aspectRatioPlugin,
  ],
} 