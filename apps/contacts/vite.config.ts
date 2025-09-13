import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6003,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:6003",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: { port: 6003, strictPort: true },
});
