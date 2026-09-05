import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import fs from 'fs'
import path from 'path'
import ProjectDetails from '../../components/features/ProjectDetails/ProjectDetails'
import { parseMarkdownFile } from '../../lib/markdownUtils'

// Every ASCII drawing the site ships, wherever it lives. Content moves between
// pages; the requirement that a box-drawing carries a text alternative does not.
// Research and project pages both route through ProjectDetails, so one sweep
// covers the shipped mapping for all of them (A11Y-DIAGRAM-001).

// The precedence-order drawing uses arrows rather than a box, so matching on
// '┌' alone would silently pass it over — the one drawing with no border is
// exactly the one a border-based selector would miss.
const BOX = /[┌│└├─►▟░]/

const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) return walk(full)
        return entry.name.endsWith('.mdx') ? [full] : []
    })

const withDrawings = walk(path.join(process.cwd(), 'content')).filter((file) => {
    const raw = fs.readFileSync(file, 'utf8')
    return raw.includes('```text') && BOX.test(raw)
})

const asciiPres = (container: HTMLElement): HTMLPreElement[] =>
    Array.from(container.querySelectorAll('pre')).filter(pre =>
        BOX.test(pre.textContent ?? ''))

describe('ASCII drawings through the shipped MDX pipeline', () => {
    it('finds pages that ship drawings, so an empty sweep cannot pass silently', () => {
        expect(withDrawings.length).toBeGreaterThan(0)
    })

    it.each(withDrawings.map(f => [path.relative(process.cwd(), f), f]))(
        '%s renders every drawing with a text alternative',
        async (_label, file) => {
            const { metaData, mdxSource } = await parseMarkdownFile(file)
            if (!mdxSource) throw new Error('mdxSource missing')
            const slug = path.basename(file, '.mdx')
            const container = render(
                <ProjectDetails project={{ slug, metaData, mdxSource }} />
            ).container

            const fences = (fs.readFileSync(file, 'utf8').match(/```text\n/g) ?? []).length
            const pres = asciiPres(container)
            // The count comes from the source, not from a number typed here, so
            // adding or dropping a drawing never has to be mirrored in the test.
            expect(pres.length, 'a fenced drawing failed to reach the DOM').toBe(fences)

            pres.forEach(pre => {
                const figure = pre.closest('figure[role="img"]')
                expect(figure, 'ASCII drawing must sit inside figure[role="img"]').not.toBeNull()
                expect(figure?.getAttribute('aria-label')?.trim(),
                    'figure[role="img"] needs a non-empty aria-label').toBeTruthy()
                expect(pre.closest('[aria-hidden="true"]'),
                    'raw box-drawing must be hidden from AT').not.toBeNull()
                // <pre> is the semantic carrier: role="img" describes the figure,
                // but the element holding the characters still has to preserve
                // whitespace without help from the stylesheet.
                expect(pre.tagName).toBe('PRE')
                expect(pre.querySelector('code'),
                    'fenced source should render <pre><code>').not.toBeNull()
            })

            expect(await axe(container)).toHaveNoViolations()
        }
    )
})
