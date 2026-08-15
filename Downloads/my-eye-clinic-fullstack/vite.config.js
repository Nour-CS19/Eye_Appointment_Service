import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel serves this app from the domain root.
  base: '/',
  server: {
    host: '0.0.0.0',
  },
})
