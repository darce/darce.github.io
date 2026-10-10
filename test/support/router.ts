import { vi } from 'vitest'

// Routing and browser media APIs are environmental seams; content and components stay real.
export const router = {
    asPath: '/', pathname: '/', route: '/', query: {}, isReady: true,
    push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(),
    events: { on: vi.fn(), off: vi.fn() },
}
