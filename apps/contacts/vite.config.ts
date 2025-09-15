import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@bhq/ui": fileURLToPath(new URL("../../packages/ui/src", import.meta.url)),
      "@bhq/config": fileURLToPath(new URL("../../packages/config/src", import.meta.url)),
      "@bhq/api": fileURLToPath(new URL("../../packages/api/src", import.meta.url)),
    },
  },
  server: { port: 6173, strictPort: true },
});
