import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  publicDir: 'assets',
  build: {
    outDir: './dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: 'esbuild',
    esbuildOptions: {
      drop: ['console', 'debugger']
    },
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
          vendor: ['vite']
        }
      },
      external: ['fsevents']
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true
  },
  preview: {
    port: 3000,
    strictPort: true
  }
}) 