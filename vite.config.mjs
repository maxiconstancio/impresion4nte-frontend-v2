import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    allowedHosts: ['srvadostrelew.ddns.net', 'localhost', '192.168.1.38'],
  },
  plugins: [react()    
  ],
  build: {
    sourcemap: true
  }
})