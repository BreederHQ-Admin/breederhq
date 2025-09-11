import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@bhq/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@bhq/mock': path.resolve(__dirname, '../../packages/mock/src'),
      '@bhq/config': path.resolve(__dirname, '../../packages/config'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 6003,
    strictPort: true,
  },
  preview: {
    port: 6003,
    strictPort: true,
  },
})
