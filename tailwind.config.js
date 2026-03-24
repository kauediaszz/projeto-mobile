/** @type {import('tailwindcss').Config} */
module.exports = {
  // Aqui dizemos onde o Tailwind deve procurar as classes
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  // 👇 ESSA É A LINHA MÁGICA DA VERSÃO 4 👇
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
