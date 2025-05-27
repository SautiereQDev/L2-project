import {defineVitestConfig} from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],
  },
})
