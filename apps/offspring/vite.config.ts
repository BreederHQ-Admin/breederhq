import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@bhq/api": resolve(__dirname, "../../packages/api/src"),
      "@bhq/ui": resolve(__dirname, "../../packages/ui/src"),
      "@bhq/config": resolve(__dirname, "../../packages/config/src")
    }
  },
  build: {
    outDir: "dist",
    target: "es2020",
    sourcemap: false
  },
  server: {
    port: 5176,
    proxy: {
      "/api": {
        target: "https://breederhq-api.onrender.com",
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, "")
      }
    }
  }
});
