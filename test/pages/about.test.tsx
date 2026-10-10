import { describe, expect, it } from 'vitest'
import { render, within } from '@testing-library/react'
import AboutPage from '../../pages/about'
import { getMdxContent } from '../../lib/getMdxContent'
import { articles } from '../support/content'
import { buildItemPath } from '../../lib/routes'

describe('About navigation and portrait', () => {
    it('renders the portrait, contact action, and links to content that exists', async () => {
        const { parsedMdxArray: aboutData } = await getMdxContent({ subDir: 'about' })
        const { container } = render(<AboutPage aboutData={aboutData} />)
        const view = within(container)
        expect(view.getByRole('img')).toHaveAccessibleName()
        const validRoutes = new Set(articles.map(({ section, slug }) => buildItemPath(section, slug) + '/'))
        const links = view.getAllByRole('link')
        const internal = links.filter(link => /^\/(projects|research)\//.test(link.getAttribute('href') ?? ''))
        expect(internal.length).toBeGreaterThan(0)
        for (const link of internal) expect(validRoutes.has(link.getAttribute('href')!)).toBe(true)
        const contact = links.find(link => link.getAttribute('href')?.startsWith('mailto:'))
        expect(contact).toHaveAccessibleName()
    })
})
