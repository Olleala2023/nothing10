import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'app/index.html': resolve(__dirname, 'src/app/index.html'),
        'focus-lock/index.html': resolve(__dirname, 'public/focus-lock/index.html'),
        'legal/privacy.html': resolve(__dirname, 'public/legal/privacy.html'),
        'legal/terms.html': resolve(__dirname, 'public/legal/terms.html')
      }
    },
    assetsInlineLimit: 0, // Не инлайнить ассеты, чтобы они получали хеши
    cssCodeSplit: true, // Разделять CSS файлы для лучшего кеширования
    sourcemap: false // Отключить sourcemap для production
  },
  publicDir: 'public', // Использовать public/ как статическую директорию
  base: '/', // Базовый путь для ассетов
  server: {
    port: 5173,
    open: true
  }
})
