import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'naive-ui', 'pinia'],
          utils: ['@vueuse/core', 'vue-i18n']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://apimail.yzcjwds.xyz',
        changeOrigin: true,
        secure: true,
      },
      '/admin': {
        target: 'https://apimail.yzcjwds.xyz',
        changeOrigin: true,
        secure: true,
      },
      '/telegram': {
        target: 'https://apimail.yzcjwds.xyz',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
