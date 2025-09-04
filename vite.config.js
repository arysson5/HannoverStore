import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    // Plugin para copiar arquivos estáticos
    {
      name: 'copy-static-assets',
      generateBundle() {
        // Copiar logo para o diretório de build
        try {
          copyFileSync(
            resolve(__dirname, 'public/Hanover logo bg.png'),
            resolve(__dirname, 'dist/Hanover logo bg.png')
          )
          console.log('✅ Logo copiada para o build')
        } catch (error) {
          console.warn('⚠️ Erro ao copiar logo:', error.message)
        }
      }
    }
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
  base: '/'
})
