import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Dependencies are declared in package.json; avoid Vitest's interactive installer
// probing parent directories in restricted workspace environments.
process.env.VITEST_SKIP_INSTALL_CHECKS ??= '1'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    clearMocks: true
  }
})
