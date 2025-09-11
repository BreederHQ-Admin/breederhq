import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6004,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:6001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: { port: 6004, strictPort: true },
});
