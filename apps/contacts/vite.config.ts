import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@bhq/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@bhq/mock": path.resolve(__dirname, "../../packages/mock/src"),
      "@bhq/config": path.resolve(__dirname, "../../packages/config"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 6003,
    strictPort: true,
    proxy: {
      // forward /api/* to the API on 6001
      "/api": {
        target: "http://localhost:6001",
        changeOrigin: true,
        secure: false,
        // keep the path as-is (/api/v1/...)
        // if you ever want to drop the /api prefix, use:
        // rewrite: (p) => p.replace(/^\/api/, "")
      },
    },
  },
  preview: { port: 6003, strictPort: true },
});
