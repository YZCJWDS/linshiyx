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
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    include: ['axios', 'vue', 'naive-ui', '@vicons/ionicons5']
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