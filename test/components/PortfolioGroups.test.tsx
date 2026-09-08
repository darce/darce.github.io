import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import fs from 'fs'
import path from 'path'
import PortfolioGroups, { groupPortfolioItems, PortfolioGroup } from '../../components/features/PortfolioGroups/PortfolioGroups'
import { ContentIndexData } from '../../types'

const item = (slug: string): ContentIndexData => ({
    slug,
    metaData: { title: slug, subtitle: `${slug} subtitle` },
} as ContentIndexData)

const GROUPS: PortfolioGroup[] = [
    { id: 'first-group', title: 'First group', description: 'One.', items: [item('a'), item('b')] },
    { id: 'second-group', title: 'Second group', description: 'Two.', items: [item('c')] },
]

const renderIndex = (groups: PortfolioGroup[] = GROUPS) =>
    render(
        <main id="main-content">
            <PortfolioGroups section="projects" title="Work" description="Intro." groups={groups} />
        </main>
    ).container

describe('groupPortfolioItems', () => {
    const fallback = { id: 'more', title: 'More', description: 'Rest.' }

    it('drops empty groups and keeps uncategorised entries in a fallback group', () => {
        const groups = groupPortfolioItems(
            [item('a'), item('z')],
            [
                { id: 'has-one', title: 'Has one', description: '', slugs: ['a'] },
                { id: 'has-none', title: 'Has none', description: '', slugs: ['missing'] },
            ],
            fallback,
        )
        expect(groups.map(g => g.id)).toEqual(['has-one', 'more'])
        expect(groups[1].items.map(i => i.slug)).toEqual(['z'])
    })

    it('places a slug listed in two definitions in the first one only', () => {
        const groups = groupPortfolioItems(
            [item('a')],
            [
                { id: 'one', title: 'One', description: '', slugs: ['a'] },
                { id: 'two', title: 'Two', description: '', slugs: ['a'] },
            ],
            fallback,
        )
        expect(groups.map(g => g.id)).toEqual(['one'])
    })
})

describe('PortfolioGroups navigation', () => {
    it('gives every group a return path to the top of the index', () => {
        const container = renderIndex()
        const sections = Array.from(container.querySelectorAll('section[aria-labelledby]'))
        expect(sections.length).toBe(GROUPS.length)

        // A jump list with no way back leaves the site navigation off-screen
        // from the last group onward, which is most of the page on a phone.
        sections.forEach(section => {
            const back = Array.from(section.querySelectorAll('a')).find(a => /back to top/i.test(a.textContent ?? ''))
            expect(back, 'each group needs a "Back to top" link').toBeTruthy()
            const target = container.querySelector(back!.getAttribute('href')!)
            expect(target, 'the return link must resolve to an element on the page').not.toBeNull()
            // Scrolling without moving focus returns the eye and strands the
            // keyboard; the target has to be able to take focus.
            expect(target?.getAttribute('tabindex')).toBe('-1')
        })
    })

    it('points every topic link at a heading that exists', () => {
        const container = renderIndex()
        const topics = Array.from(container.querySelectorAll('nav a'))
        expect(topics.length).toBe(GROUPS.length)
        topics.forEach(link => {
            const id = link.getAttribute('href')!.slice(1)
            expect(container.querySelector(`h3#${id}`), `no heading for ${id}`).not.toBeNull()
        })
    })

    it('omits the jump list and return links when there is only one group', () => {
        const container = renderIndex([GROUPS[0]])
        expect(container.querySelector('nav')).toBeNull()
        expect(container.textContent).not.toMatch(/back to top/i)
    })

    it('has no axe violations', async () => {
        expect(await axe(renderIndex())).toHaveNoViolations()
    })
})

describe('PortfolioGroups page shell', () => {
    // jsdom does not apply the SCSS module, so the padding regression that put
    // the index flush against the viewport edge is only visible in the source.
    const scss = fs.readFileSync(
        path.join(process.cwd(), 'components/features/PortfolioGroups/PortfolioGroups.module.scss'),
        'utf8',
    )

    it('insets the index the way every other top-level page wrapper does', () => {
        const index = scss.slice(scss.indexOf('.index {'))
        expect(index).toMatch(/padding:\s*\$s-x-large;/)
        expect(index).toMatch(/padding:\s*\$s-large;/)
    })

    it('takes spacing from the scale rather than raw lengths', () => {
        const literals = scss.match(/(?:padding|margin|gap)[a-z-]*:[^;]*\b\d*\.?\d+(?:rem|px|em)\b[^;]*;/g) ?? []
        expect(literals, `off-scale spacing: ${literals.join(' ')}`).toEqual([])
    })
})
