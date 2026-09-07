import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Empty prefix: DEV_API_TARGET is deliberately not VITE_*, so it stays out of the bundle.
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.DEV_API_TARGET || 'http://localhost:3000'

  return {
    plugins: [react()],
    server: {
      // Mirrors nginx.conf so dev matches prod: relative /api and /uploads, no CORS.
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/uploads': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
