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

    it('introduces the current role beside the portrait', () => {
        const container = mount()
        expect(container.querySelector('h2')?.textContent).toBe("Hello, I'm Daniel Arcé.")
        expect(container.querySelector('figure img')?.getAttribute('alt')).toBe('Daniel Arcé, portrait by Liam Maloney')
        const intro = container.querySelector('h2')?.parentElement
        expect(intro?.querySelector('p')?.textContent).toMatch(/^I'm a product designer and design technologist\./)
        expect(container.textContent).not.toMatch(/product engineer/i)
    })

    it('uses a continuous heading outline with prose directly in the article', () => {
        const container = mount()
        expect(Array.from(container.querySelectorAll('h2, h3')).map(h => h.textContent)).toEqual([
            "Hello, I'm Daniel Arcé.",
            'What a prototype settles',
            'Two products of my own',
            'Bringing the work to launch',
            'How I decide',
            'Get in touch',
        ])
        expect(container.querySelectorAll('h4, h5, h6')).toHaveLength(0)
        expect(container.querySelectorAll('article > p').length).toBeGreaterThan(0)
        expect(container.querySelectorAll('article > h3').length).toBe(5)
    })

    it('connects the bio to the selected work and supporting research', () => {
        const container = mount()
        const hrefs = Array.from(container.querySelectorAll('a')).map(a => a.getAttribute('href'))
        for (const slug of ['visual-search-workbench', 'altcontext', 'photoshelter', 'msnbc', 'workbay']) {
            expect(hrefs).toContain(`/projects/${slug}/`)
        }
        expect(hrefs).toContain('/research/heuristics-canon/')
    })

    it('keeps the contact action explicit instead of making a prose block clickable', () => {
        const container = mount()
        expect(container.querySelector('a[href="mailto:daniel.arce@gmail.com"]')?.textContent).toBe('Email me')
        expect(container.querySelector('a h3')).toBeNull()
        expect(container.querySelector('a a')).toBeNull()
    })
})
