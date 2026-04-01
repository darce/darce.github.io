import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../../components/common/ErrorBoundary'

const ThrowingComponent = () => {
    throw new Error('Test error')
}

const WorkingComponent = () => <p>Working content</p>

describe('ErrorBoundary', () => {
    // Suppress console.error for expected errors
    const originalError = console.error
    beforeEach(() => {
        console.error = vi.fn()
    })
    afterEach(() => {
        console.error = originalError
    })

    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <WorkingComponent />
            </ErrorBoundary>
        )
        expect(screen.getByText('Working content')).toBeInTheDocument()
    })

    it('renders fallback when child throws', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        )
        expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
        expect(screen.getByText('Return to homepage')).toBeInTheDocument()
    })

    it('provides a link back to the homepage', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        )
        const link = screen.getByRole('link', { name: 'Return to homepage' })
        expect(link).toHaveAttribute('href', '/')
    })
})
