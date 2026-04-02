import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import ErrorBoundary from '../../components/common/ErrorBoundary'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle'
import { ThemeProvider } from '../../contexts/ThemeContext'

beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        })),
    })
})

describe('Component accessibility', () => {
    it('ErrorBoundary fallback has no a11y violations', async () => {
        const Throw = () => { throw new Error('test') }
        const orig = console.error
        console.error = vi.fn()
        const { container } = render(
            <ErrorBoundary><Throw /></ErrorBoundary>
        )
        console.error = orig
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('ThemeToggle has no a11y violations', async () => {
        const { container } = render(
            <ThemeProvider><ThemeToggle /></ThemeProvider>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
})
