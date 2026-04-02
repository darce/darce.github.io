import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle'
import { ThemeProvider } from '../../contexts/ThemeContext'

const renderWithTheme = () =>
    render(
        <ThemeProvider>
            <ThemeToggle />
        </ThemeProvider>
    )

describe('ThemeToggle', () => {
    beforeEach(() => {
        localStorage.clear()
        // Mock matchMedia to return light preference
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

    it('renders a button', () => {
        renderWithTheme()
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has an accessible label', () => {
        renderWithTheme()
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('aria-label')
    })

    it('toggles aria-label on click', async () => {
        const user = userEvent.setup()
        renderWithTheme()
        const button = screen.getByRole('button')

        const initialLabel = button.getAttribute('aria-label')
        await user.click(button)
        const newLabel = button.getAttribute('aria-label')

        expect(initialLabel).not.toBe(newLabel)
    })

    it('persists preference in localStorage', async () => {
        const user = userEvent.setup()
        renderWithTheme()
        const button = screen.getByRole('button')

        await user.click(button)
        expect(localStorage.getItem('theme-preference')).toBe('dark')

        await user.click(button)
        expect(localStorage.getItem('theme-preference')).toBe('light')
    })
})
