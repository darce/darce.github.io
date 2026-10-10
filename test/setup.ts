import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

vi.mock('next/router', async () => {
    const { router } = await import('./support/router')
    return { useRouter: () => router }
})

beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: vi.fn(query => ({
            matches: false, media: query, onchange: null,
            addListener: vi.fn(), removeListener: vi.fn(),
            addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
        })),
    })
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.useRealTimers()
})
