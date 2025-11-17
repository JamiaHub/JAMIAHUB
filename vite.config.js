import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/JAMIAHUB/', // Your repo name
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
})