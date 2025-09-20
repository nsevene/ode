import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    hmr: {
      port: 5001,
      clientPort: 443,
      host: '0.0.0.0'
    },
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5000
  }
})
