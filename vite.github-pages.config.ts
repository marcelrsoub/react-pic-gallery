import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/react-pic-gallery/',
  build: {
    outDir: 'build'
  }
})
