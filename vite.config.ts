import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Build y preview usan la base del repo; dev se sirve desde '/'.
  base: mode === 'production' ? '/Portfolio/' : '/',
}))
