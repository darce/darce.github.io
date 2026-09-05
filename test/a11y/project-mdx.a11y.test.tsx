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

describe('visual-search-workbench through the shipped MDX pipeline', () => {
    let project: MarkdownData

    beforeAll(async () => {
        const { metaData, mdxSource } = await parseMarkdownFile(MDX_PATH)
        if (!mdxSource) throw new Error('mdxSource missing')
        project = { slug: 'visual-search-workbench', metaData, mdxSource }
    })

    // testing-library auto-cleanup unmounts after each test, so render per test
    const mount = () => render(<ProjectDetails project={project} />).container

    it('renders the download link ahead of the case study (top of page)', () => {
        const container = mount()
        const download = container.querySelector<HTMLAnchorElement>('a[href^="https://dl.darce.xyz"]')
        expect(download, 'a download link must render').not.toBeNull()

        // "Top of the page" is a claim about document order, not about which
        // file the URL sits in. The link belongs to the header aside, and every
        // body heading has to come after it, so moving the link down into the
        // prose fails here rather than passing on the frontmatter alone.
        expect(download!.closest('aside'), 'the link belongs to the header aside').not.toBeNull()

        const headings = Array.from(container.querySelectorAll('h2, h3'))
        // DOCUMENT_POSITION_FOLLOWING: the heading comes after the link.
        const after = headings.filter(h =>
            download!.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING)
        expect(after.length, 'the case study body must follow the link').toBeGreaterThan(0)
    })

    it('has no axe violations', async () => {
        const results = await axe(mount())
        expect(results).toHaveNoViolations()
    })
})
