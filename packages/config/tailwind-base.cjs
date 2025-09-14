const preset =
  require("./dist/tailwind-preset.js").default ||
  require("./tailwind-preset").default;

module.exports = {
  presets: [preset],
  content: [
    "../../apps/**/*.{ts,tsx,js,jsx}",
    "../ui/src/**/*.{ts,tsx}",
  ],
};
