import { describe, it, expect, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import path from 'path'
import ProjectDetails from '../../components/features/ProjectDetails/ProjectDetails'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import type { MarkdownData } from '../../types'

// Research pages route through SectionView -> ProjectDetails, the same component
// the project cases use, so the essay's drawings are renderable by the same
// mapping and testable by the same harness as project-mdx.a11y.test.tsx.

const MDX_PATH = path.join(
    process.cwd(), 'content', 'research', 'visual-search-workbench-process.mdx')

// The precedence-order drawing uses arrows rather than a box, so matching on
// '┌' alone would silently pass it over — the one drawing with no border is
// exactly the one a border-based selector would miss.
const asciiPres = (container: HTMLElement): HTMLPreElement[] =>
    Array.from(container.querySelectorAll('pre')).filter(pre =>
        /[┌│└├─►▟░]/.test(pre.textContent ?? ''))

describe('visual-search-workbench process essay through the shipped MDX pipeline', () => {
    let doc: MarkdownData

    beforeAll(async () => {
        const { metaData, mdxSource } = await parseMarkdownFile(MDX_PATH)
        if (!mdxSource) throw new Error('mdxSource missing')
        doc = { slug: 'visual-search-workbench-process', metaData, mdxSource }
    })

    const mount = () => render(<ProjectDetails project={doc} />).container

    it('renders all three ASCII drawings through the real component mapping', () => {
        expect(asciiPres(mount())).toHaveLength(3)
    })

    it('gives every drawing a text alternative (A11Y-DIAGRAM-001)', () => {
        const pres = asciiPres(mount())
        expect(pres.length).toBeGreaterThan(0)
        pres.forEach(pre => {
            const figure = pre.closest('figure[role="img"]')
            expect(figure, 'ASCII drawing must sit inside figure[role="img"]').not.toBeNull()
            const label = figure?.getAttribute('aria-label')?.trim()
            expect(label, 'figure[role="img"] needs a non-empty aria-label').toBeTruthy()
            expect(pre.closest('[aria-hidden="true"]'),
                'raw box-drawing must be hidden from AT').not.toBeNull()
        })
    })

    it('keeps the drawing preformatted, so the alignment survives the DOM', () => {
        // <pre> is the semantic carrier here: role="img" describes the figure,
        // but the element holding the characters still has to be the one that
        // preserves whitespace. A <div> with CSS would lose the meaning if the
        // stylesheet ever failed to load.
        asciiPres(mount()).forEach(pre => {
            expect(pre.tagName).toBe('PRE')
            expect(pre.querySelector('code'), 'fenced source should render <pre><code>').not.toBeNull()
        })
    })

    it('has no axe violations', async () => {
        const results = await axe(mount())
        expect(results).toHaveNoViolations()
    })
})
