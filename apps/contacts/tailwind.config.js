/** @type {import('tailwindcss').Config} */
const preset =
  require("../../packages/config/dist/tailwind-preset.js").default ||
  require("../../packages/config/tailwind-preset").default;

module.exports = {
  presets: [preset],
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "../../packages/ui/src/**/*.{ts,tsx,js,jsx,css}",
  ],
};
