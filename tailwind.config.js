/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      "logo": ["Courgette", "Arial"]
    },
    screens: {
      "phone": {"max": "610px"}
    },
    extend: {},
  },
  plugins: [
    require("tailwindcss-animation-delay")
  ],
}

