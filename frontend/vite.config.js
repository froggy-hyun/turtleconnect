import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 프록시
  server: {
    proxy: {
      '/api': {
        target: 'http://13.125.8.150', // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
