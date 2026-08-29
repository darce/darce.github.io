import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// The process essay draws the same kind of ASCII screens the project case does,
// but reached them through bare fences, so it inherited none of the treatment
// that page's drawings get: no text alternative, and prose styling that wraps
// box-drawing until the boxes stop being boxes.

const file = path.join(process.cwd(), 'content/research/visual-search-workbench-process.mdx')
const scss = path.join(process.cwd(),
    'components/features/ProjectDetails/ProjectDetails.module.scss')

describe('visual-search-workbench process essay: ASCII screens', () => {
    const { content } = matter(fs.readFileSync(file, 'utf8'))

    it('draws every ASCII screen through the AsciiScreen component, not a bare fence', () => {
        const fences = content.match(/```[\s\S]*?```/g) ?? []
        expect(fences.length, 'the essay should still contain its drawings').toBe(3)

        // A bare fence renders <pre><code> with no accessible name, so a screen
        // reader announces raw box-drawing character by character. The project
        // case already solved this; the fix is to reuse it, not to invent a
        // second treatment for the same content type.
        for (const fence of fences) {
            expect(content).toMatch(
                new RegExp(`<AsciiScreen label="[^"]{40,}">\\s*${
                    fence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*</AsciiScreen>`))
        }
    })

    it('tags the fences as text so no highlighter guesses a language', () => {
        expect((content.match(/```text\n/g) ?? []).length).toBe(3)
    })

    it('labels each drawing with what it shows, not what it is', () => {
        const labels = [...content.matchAll(/<AsciiScreen label="([^"]+)">/g)].map(m => m[1])
        expect(labels).toHaveLength(3)
        for (const label of labels) {
            // "ASCII diagram" tells a non-sighted reader nothing the role does
            // not already say. The label has to carry the content the drawing
            // carries, which is the only reason to hide the drawing itself.
            expect(label.toLowerCase()).not.toMatch(/^(ascii|diagram|screen)\b\W*$/)
            expect(label.length).toBeGreaterThan(40)
        }
    })
})

describe('ASCII screens are legible in both themes', () => {
    const css = fs.readFileSync(scss, 'utf8')
    const block = css.slice(css.indexOf('.asciiScreen'),
        css.indexOf('@media', css.indexOf('.asciiScreen')))

    it('paints its own surface instead of inheriting the page canvas', () => {
        // The light canvas is $paper (#e7eaef), a blue-grey. A drawing meant to
        // read as a screen needs to sit on its own field.
        expect(block).toMatch(/background(-color)?:\s*(#fff|#ffffff|white)\b/i)
    })

    it('pins the ink with the paper, so dark mode cannot invert one without the other', () => {
        // This is the whole risk of hardcoding a white background on a themed
        // page: in dark mode the inherited text colour is $terminal-ink
        // (#cbcdd2), which on white is 1.7:1 — invisible, and a WCAG failure
        // that only appears for readers who chose the dark theme.
        expect(block).toMatch(/color:\s*\$ink\b/)
    })

    it('sets the monospace family on the drawing itself', () => {
        // Inheriting it from the prose `code` rule means any later change to
        // that rule silently reflows every drawing.
        expect(block).toMatch(/font-family:[^;]*monospace/)
    })

    it('keeps columns intact rather than wrapping them', () => {
        expect(block).toMatch(/white-space:\s*pre\b/)
    })
})
