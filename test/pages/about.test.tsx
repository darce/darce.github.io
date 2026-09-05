import { describe, it, expect, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import AboutPage from '../../pages/about'
import { getMdxContent } from '../../lib/getMdxContent'
import type { MarkdownData } from '../../types'

describe('about page reading flow', () => {
    let aboutData: MarkdownData[] = []

    beforeAll(async () => {
        aboutData = (await getMdxContent({ subDir: 'about' })).parsedMdxArray
    })

    const mount = () => render(<AboutPage aboutData={aboutData} />).container

    it('opens with a heading beside the portrait', () => {
        const container = mount()
        expect(container.querySelector('h2')?.textContent?.trim()).toBeTruthy()
        expect(container.querySelector('figure img')?.getAttribute('alt')).toBeTruthy()
        const intro = container.querySelector('h2')?.parentElement
        expect(intro?.querySelector('p')?.textContent?.trim()).toBeTruthy()
    })

    it('uses a continuous heading outline with prose directly in the article', () => {
        const container = mount()
        expect(container.querySelectorAll('h4, h5, h6')).toHaveLength(0)
        expect(container.querySelectorAll('article > p').length).toBeGreaterThan(0)
        expect(container.querySelectorAll('article > h3').length).toBeGreaterThan(0)
    })

    it('resolves every internal link it renders to a real route', () => {
        const container = mount()
        const hrefs = Array.from(container.querySelectorAll('a')).map(a => a.getAttribute('href') ?? '')
        const internal = hrefs.filter(h => h.startsWith('/projects/') || h.startsWith('/research/'))
        expect(internal.length).toBeGreaterThan(0)
        for (const href of internal) {
            expect(href).toMatch(/^\/(projects|research)\/[a-z0-9-]+\/$/)
        }
    })

    it('keeps the contact action explicit instead of making a prose block clickable', () => {
        const container = mount()
        const mail = container.querySelector('a[href^="mailto:"]')
        expect(mail?.textContent?.trim()).toBeTruthy()
        expect(container.querySelector('a h3')).toBeNull()
        expect(container.querySelector('a a')).toBeNull()
    })
})
