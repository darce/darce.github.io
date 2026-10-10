import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    oxc: {
        jsx: { runtime: 'automatic' },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./test/setup.ts'],
        include: ['test/**/*.test.{ts,tsx}'],
        globals: true,
        maxWorkers: 2,
        testTimeout: 15000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname),
        },
    },
})
