import { describe, it, expect, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import AboutPage from '../../pages/about'
import { getMdxContent } from '../../lib/getMdxContent'
import type { MarkdownData } from '../../types'

// The About page shares the Work / Research index grammar: an intro row, then
// a grid of badge + title cards. These tests render the shipped page over the
// real MDX so a content edit that breaks the structure fails here.

describe('about page card reflow', () => {
    let aboutData: MarkdownData[] = []

    beforeAll(async () => {
        aboutData = (await getMdxContent({ subDir: 'about' })).parsedMdxArray
    })

    // testing-library unmounts after each test, so every test mounts its own copy.
    const mount = () => render(<AboutPage aboutData={aboutData} />).container

    it('opens with the greeting beside the headshot, then the role sentence', () => {
        const container = mount()
        const headings = Array.from(container.querySelectorAll('h2, h3')).map((h) => h.tagName)
        expect(headings[0]).toBe('H2')
        expect(container.querySelector('h2')?.textContent).toBe("Hello, I'm Daniel Arcé.")
        expect(container.querySelector('figure img')?.getAttribute('alt')).toBe('Daniel Arcé, portrait by Liam Maloney')
        const intro = container.querySelector('h2')?.parentElement
        expect(intro?.querySelector('p')?.textContent).toMatch(/^I'm a product engineer\./)
    })

    it('renders the bio as labelled cards with one h3 each, no skipped levels', () => {
        const container = mount()
        const cards = Array.from(container.querySelectorAll('h3')).map((h3) => {
            const badge = h3.previousElementSibling?.textContent
            return `${badge}: ${h3.textContent}`
        })
        expect(cards).toEqual([
            'Background: Interactive media, then front-end systems',
            'Evidence: PhotoShelter',
            'Now: Visual Search Workbench and WorkBay',
            'Practice: Heuristics Canon',
            'Looking for: Senior product and design-engineering roles',
            'Contact: daniel.arce@gmail.com',
        ])
        expect(container.querySelectorAll('h4, h5, h6')).toHaveLength(0)
    })

    it('links the evidence to the cases it cites', () => {
        const container = mount()
        const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
        expect(hrefs).toContain('/projects/photoshelter/')
        expect(hrefs).toContain('/projects/visual-search-workbench/')
        expect(hrefs).toContain('/projects/workbay/')
        expect(hrefs).toContain('/research/heuristics-canon/')
        expect(hrefs).toContain('https://github.com/darce/heuristics-canon')
    })

    it('makes the contact card the only whole-card link', () => {
        const container = mount()
        const cardLinks = Array.from(container.querySelectorAll('a')).filter((a) => a.querySelector('h3'))
        expect(cardLinks).toHaveLength(1)
        expect(cardLinks[0].getAttribute('href')).toBe('mailto:daniel.arce@gmail.com')
        // No nested anchors: a static card may carry inline links, a link card may not.
        expect(cardLinks[0].querySelectorAll('a')).toHaveLength(0)
    })
})
