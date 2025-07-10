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
    // 强制预打包图标库，确保构建时能正确处理
    rollupOptions: {
      output: {
        manualChunks: {
          'icons': ['@vicons/ionicons5']
        }
      }
    }
  },
  // 明确指定需要预构建的依赖
  optimizeDeps: {
    include: ['@vicons/ionicons5']
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
