import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { auditAccessibility } from '../support/shell'
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
        const included = item('included')
        const remaining = item('uncategorised')
        const definitions = [
            { id: 'has-items', title: 'Included', description: '', slugs: [included.slug] },
            { id: 'empty', title: 'Empty', description: '', slugs: ['missing'] },
        ]
        const groups = groupPortfolioItems([included, remaining], definitions, fallback)
        expect(groups.map(group => group.id)).toEqual([definitions[0].id, fallback.id])
        expect(groups[0].items).toEqual([included])
        expect(groups[1].items).toEqual([remaining])
    })

    it('places an item listed twice in the first group only', () => {
        const included = item('shared')
        const definitions = [
            { id: 'first', title: 'First', description: '', slugs: [included.slug] },
            { id: 'second', title: 'Second', description: '', slugs: [included.slug] },
        ]
        const groups = groupPortfolioItems([included], definitions, fallback)
        expect(groups.map(group => group.id)).toEqual([definitions[0].id])
        expect(groups[0].items).toEqual([included])
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
            const back = Array.from(section.querySelectorAll('a')).find(a => a.getAttribute('href')?.startsWith('#') && !section.contains(container.querySelector(a.getAttribute('href')!)))
            expect(back, 'each group needs a "Back to top" link').toBeTruthy()
            const target = container.querySelector(back!.getAttribute('href')!)
            expect(target, 'the return link must resolve to an element on the page').not.toBeNull()
            // Scrolling without moving focus returns the eye and strands the
            // keyboard; the target has to be able to take focus.
            expect(target?.getAttribute('tabindex')).toBe('-1')
            ;(target as HTMLElement).focus()
            expect(target).toHaveFocus()
        })
    })

    it('points every topic link at a heading that exists', () => {
        const container = renderIndex()
        const topics = Array.from(container.querySelectorAll('nav a'))
        expect(topics.length).toBe(GROUPS.length)
        topics.forEach(link => {
            const id = link.getAttribute('href')!.slice(1)
            expect(container.querySelector(`[id="${id}"]`), `no heading for ${id}`).not.toBeNull()
        })
    })

    it('omits the jump list and return links when there is only one group', () => {
        const container = renderIndex([GROUPS[0]])
        expect(container.querySelector('nav')).toBeNull()
        expect(container.querySelector('section a[href^="#"]')).toBeNull()
    })

    it('has no axe violations', async () => {
        expect(await auditAccessibility(renderIndex())).toHaveNoViolations()
    })
})
