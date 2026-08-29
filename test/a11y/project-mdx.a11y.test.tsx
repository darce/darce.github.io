import { describe, it, expect, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import path from 'path'
import ProjectDetails from '../../components/features/ProjectDetails/ProjectDetails'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import type { MarkdownData } from '../../types'

// Renders the shipped ProjectDetails component over the real serialized MDX —
// the same pipeline pages/projects/[slug] uses — so these assertions can fail
// when the shipped rendering regresses (A11Y-COVERAGE-004 / ENGA-A11Y-FIXTURE-BINDING-003).

const MDX_PATH = path.join(process.cwd(), 'content', 'projects', 'visual-search-workbench.mdx')

const asciiPres = (container: HTMLElement): HTMLPreElement[] =>
    Array.from(container.querySelectorAll('pre')).filter(pre =>
        pre.textContent?.includes('┌'))

describe('visual-search-workbench through the shipped MDX pipeline', () => {
    let project: MarkdownData

    beforeAll(async () => {
        const { metaData, mdxSource } = await parseMarkdownFile(MDX_PATH)
        if (!mdxSource) throw new Error('mdxSource missing')
        project = { slug: 'visual-search-workbench', metaData, mdxSource }
    })

    // testing-library auto-cleanup unmounts after each test, so render per test
    const mount = () => render(<ProjectDetails project={project} />).container

    it('renders all eight ASCII screens through the real component mapping', () => {
        expect(asciiPres(mount())).toHaveLength(8)
    })

    it('gives every ASCII screen a text alternative (A11Y-DIAGRAM-001)', () => {
        const pres = asciiPres(mount())
        expect(pres.length).toBeGreaterThan(0)
        pres.forEach(pre => {
            const figure = pre.closest('figure[role="img"]')
            expect(figure, 'ASCII screen must sit inside figure[role="img"]').not.toBeNull()
            const label = figure?.getAttribute('aria-label')?.trim()
            expect(label, 'figure[role="img"] needs a non-empty aria-label').toBeTruthy()
            expect(pre.closest('[aria-hidden="true"]'), 'raw box-drawing must be hidden from AT').not.toBeNull()
        })
    })

    it('renders the download link ahead of the case study (top of page)', () => {
        const container = mount()
        const download = container.querySelector<HTMLAnchorElement>('a[href^="https://dl.darce.xyz"]')
        expect(download, 'a download link must render').not.toBeNull()

        // "Top of the page" is a claim about document order, not about which
        // file the URL sits in. Assert it against the first body heading, so
        // moving the link back down into the prose fails here rather than
        // passing on the strength of the frontmatter alone.
        const heading = Array.from(container.querySelectorAll('h2, h3'))
            .find(h => /Final product/i.test(h.textContent || ''))
        expect(heading, 'the case study must still start with Final product').toBeTruthy()

        // DOCUMENT_POSITION_FOLLOWING: the heading comes after the link.
        expect(download!.compareDocumentPosition(heading!) & Node.DOCUMENT_POSITION_FOLLOWING)
            .toBeTruthy()
    })

    it('has no axe violations', async () => {
        const results = await axe(mount())
        expect(results).toHaveNoViolations()
    })
})
