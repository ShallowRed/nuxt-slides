import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/**
 * Plain (non-Nuxt) Vitest config.
 *
 * The deck core (`shared/deck/*`) is framework-agnostic and free of Nuxt
 * auto-imports by design, so it can be unit- and golden-tested without spinning
 * up a Nuxt runtime. Server adapters that need `useStorage`/`$fetch` are tested
 * through injected fakes (dependency injection in `resolveDeck`).
 */
export default defineConfig({
  resolve: {
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.{test,spec}.ts'],
  },
})
