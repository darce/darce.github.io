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

    it('has no axe violations', async () => {
        const results = await axe(mount())
        expect(results).toHaveNoViolations()
    })
})
