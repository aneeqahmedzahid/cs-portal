/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'comsats-blue': '#1f5ca9',
        'comsats-blue-dark': '#133a6b',
        'comsats-blue-light': '#3b7dd4',
        'slate-850': '#151e2e',
        'primary': '#1E3A8A',
        'secondary': '#2563EB',
        'lightbg': '#EFF6FF',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
