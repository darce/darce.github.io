import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle'
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'
import { auditAccessibility } from '../support/shell'

const Appearance = () => <output role="status">{useTheme().appearance}</output>
const mount = () => render(<ThemeProvider><ThemeToggle /><Appearance /></ThemeProvider>)

describe('theme controls', () => {
    it('changes appearance by keyboard, updates its name, and restores the choice after remounting', async () => {
        const user = userEvent.setup()
        const view = mount()
        const button = screen.getByRole('button')
        const initial = screen.getByRole('status').textContent
        const initialName = button.getAttribute('aria-label')
        expect(await auditAccessibility(view.container)).toHaveNoViolations()
        await user.tab()
        expect(button).toHaveFocus()
        await user.keyboard(' ')
        const chosen = screen.getByRole('status').textContent
        expect(chosen).not.toBe(initial)
        expect(button).toHaveAccessibleName()
        expect(button.getAttribute('aria-label')).not.toBe(initialName)
        view.unmount()
        mount()
        expect(screen.getByRole('status')).toHaveTextContent(chosen!)
        screen.getByRole('button').focus()
        await user.keyboard('{Enter}')
        expect(screen.getByRole('status')).toHaveTextContent(initial!)
    })
})
