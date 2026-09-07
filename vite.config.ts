import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  // Empty prefix: DEV_API_TARGET is deliberately not VITE_*, so it stays out of the bundle.
  const env = loadEnv(mode, rootDir, '');
  const apiTarget = env.DEV_API_TARGET || 'http://localhost:3000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
      },
    },
    optimizeDeps: {
      include: ['antd', '@ant-design/icons'],
    },
    server: {
      // Mirrors nginx.conf so dev matches prod: relative /api and /uploads, no CORS.
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/uploads': { target: apiTarget, changeOrigin: true },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/setup.ts',
      css: false,
      include: ['tests/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/main.tsx', 'src/**/*.d.ts'],
      },
    },
  };
});
