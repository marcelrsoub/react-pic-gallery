import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    dts({
        insertTypesEntry: true,
    }),],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/main.tsx'),
      name: 'react-pic-gallery',
      fileName: (format) => `react-pic-gallery.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'React'
        }
      }
    }
  }
})
