import { describe, expect, it, vi } from 'vitest'
import { render, within } from '@testing-library/react'
import ErrorBoundary from '../../components/common/ErrorBoundary'
import { NAV_ITEMS } from '../../lib/routes'
import { auditAccessibility } from '../support/shell'

const childText = 'A working child'
const BrokenChild = () => { throw new Error('Controlled component failure') }

describe('ErrorBoundary recovery', () => {
    it('renders working children', () => {
        const { container } = render(<ErrorBoundary><p>{childText}</p></ErrorBoundary>)
        expect(container).toHaveTextContent(childText)
    })
    it('replaces a failed child with an accessible full-page recovery link', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const { container } = render(<ErrorBoundary><BrokenChild /></ErrorBoundary>)
        const view = within(container)
        expect(view.getByRole('heading')).toHaveAccessibleName()
        expect(view.getByRole('link')).toHaveAccessibleName()
        expect(view.getByRole('link')).toHaveAttribute('href', NAV_ITEMS[0].href)
        expect(await auditAccessibility(container)).toHaveNoViolations()
    })
})
