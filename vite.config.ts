import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src/lib',
      include: ['src/lib'],
      exclude: ['src/lib/**/__tests__/**'],
      insertTypesEntry: true
    })
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 300,
      ignored: [
        '**/node_modules/**',
        '**/docs-site/**',
        '**/build/**',
        '**/dist/**',
        '**/.opencode/**',
        '**/.astro/**',
        '**/.vscode/**'
      ]
    }
  },
  build: {
    lib: {
      entry: path.resolve('src/lib/index.ts'),
      name: 'react-pic-gallery',
      formats: ['es'],
      fileName: () => 'react-pic-gallery.js'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'styles.css'
      }
    },
    cssCodeSplit: false
  }
})
