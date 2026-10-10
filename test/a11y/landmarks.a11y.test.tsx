import { beforeAll, describe, expect, it } from 'vitest'
import { within } from '@testing-library/react'
import { NAV_ITEMS } from '../../lib/routes'
import NotFoundPage from '../../pages/404'
import { loadShellData, renderShell } from '../support/shell'

describe('the shipped landmark and skip navigation', () => {
    let shell: Awaited<ReturnType<typeof loadShellData>>
    beforeAll(async () => { shell = await loadShellData() })

    it('every skip destination is a named or semantic landmark that accepts focus', () => {
        const { container } = renderShell(<NotFoundPage />, shell)
        const view = within(container)
        view.getByRole('banner')
        view.getByRole('main')
        view.getByRole('contentinfo')
        const primary = view.getByRole('navigation')
        expect(primary).toHaveAccessibleName()
        const current = primary.querySelector('[aria-current="page"]')
        expect(current).toHaveAttribute('href', NAV_ITEMS[0].href)
        const skipLinks = view.getAllByRole('link').filter(link => link.getAttribute('href')?.startsWith('#'))
        const destinations = skipLinks.map(link => container.querySelector(link.getAttribute('href')!))
        expect(destinations).toContain(view.getByRole('main'))
        expect(destinations).toContain(view.getByRole('contentinfo'))
        expect(destinations).toContain(primary)
        for (const destination of destinations) {
            expect(destination).not.toBeNull()
            expect(destination).toHaveAttribute('tabindex', '-1')
            ;(destination as HTMLElement).focus()
            expect(destination).toHaveFocus()
        }
    })
})
