import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['ribbit-wallet-connect'],
    force: true
  },
  build: {
    commonjsOptions: {
      include: [/ribbit-wallet-connect/, /node_modules/]
    }
  },
  define: {
    global: 'globalThis'
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
