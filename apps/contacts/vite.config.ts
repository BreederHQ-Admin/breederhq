import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use the API *source* directly
      '@bhq/api': fileURLToPath(new URL('../../packages/api/src', import.meta.url)),
    },
  },
})
