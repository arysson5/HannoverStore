import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Manter nomes originais para imagens
          if (assetInfo.name && /\.(png|jpg|jpeg|gif|svg|ico|webp)$/.test(assetInfo.name)) {
            return '[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  base: '/',
  publicDir: 'public'
})
