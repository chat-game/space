/// <reference types="vitest" />
import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit(), svelteTesting()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    reporters: ['default', 'junit'],
    setupFiles: './tests/setupTests.ts',
    alias: {
      '@testing-library/svelte': '@testing-library/svelte/svelte5',
    },
    coverage: {
      reporter: ['clover', 'text'],
      reportsDirectory: 'build/_test',
      include: ['**.{ts,svelte}', '**/**.{ts,svelte}'],
      exclude: ['node_modules/'],
      cleanOnRerun: true,
      clean: true,
      all: true,
    },
  },
})
