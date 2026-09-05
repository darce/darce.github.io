import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { contentItemSchema } from '../../lib/schemas'

const file = path.join(process.cwd(), 'content/projects/visual-search-workbench.mdx')

describe('Visual Search Workbench case (QM-REPOSITION-01 s2)', () => {
    const raw = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    const { data, content } = matter(raw)
    const reference = matter(fs.readFileSync(path.join(process.cwd(),
        'content/research/visual-search-workbench-screen-reference.mdx'), 'utf8'))
    const screenContent = reference.content

    it('exists with schema-valid frontmatter that sorts first', () => {
        expect(fs.existsSync(file)).toBe(true)
        expect(() => contentItemSchema.parse(data)).not.toThrow()
        expect(data.title).toMatch(/Visual Search Workbench/)
        // "sorts first" means first: every sibling project must sort after it
        const siblings = fs.readdirSync(path.join(process.cwd(), 'content/projects'))
            .filter(f => f.endsWith('.mdx') && f !== 'visual-search-workbench.mdx')
        expect(siblings.length).toBeGreaterThan(0)
        for (const sibling of siblings) {
            const siblingData = matter(fs.readFileSync(
                path.join(process.cwd(), 'content/projects', sibling), 'utf8')).data
            expect(data.index, `${sibling} must sort after visual-search-workbench`)
                .toBeLessThan(siblingData.index)
        }
    })

    it('keeps every screen drawing beside a caption in the linked reference', () => {
        expect(() => contentItemSchema.parse(reference.data)).not.toThrow()
        expect(content).toContain('/research/visual-search-workbench-screen-reference/')
        expect(data.images ?? []).toHaveLength(0)
        // The caption is the accessible equivalent of a box-drawing: a fence
        // that opens without one leaves the figure with nothing describing it.
        const fences = screenContent.split('```text\n').slice(1)
        expect(fences.length).toBeGreaterThan(0)
        for (const [index, fence] of fences.entries()) {
            expect(fence.indexOf('\n```'), `fence ${index} never closes`).toBeGreaterThan(0)
        }
        const captioned = screenContent.matchAll(/(\S[^\n]*)\n+```text\n/g)
        expect(Array.from(captioned)).toHaveLength(fences.length)
        expect(screenContent).not.toMatch(/Figure pending/i)
    })

    it('routes the download through the redirect that outlives the release layout', () => {
        // The published link is dl.darce.xyz, not the GitHub URL underneath it.
        // That redirect exists so the bytes can move — different host, different
        // release layout — by editing one line of proxy config instead of every
        // page that ever linked them. Hardcoding the GitHub URL in prose forfeits
        // exactly the property the redirect was built to buy, and a page is the
        // one place where a link outlives the decision that put it there.
        expect(content).toMatch(/\]\(https:\/\/dl\.darce\.xyz\/?\)/)
        expect(content).not.toMatch(/\]\(https:\/\/github\.com\/darce\/visual-search-workbench\/releases/)
    })

    it('reaches the download from the top of the page, not only from the case study', () => {
        // The `links` slot renders in the header aside, above the MDX body —
        // where every other project puts "Live Site". Someone who came for the
        // app should not have to read a case study to find out it is downloadable.
        const link = data.links?.[0]
        expect(link, 'frontmatter needs a links entry').toBeTruthy()
        expect(link.url).toBe('https://dl.darce.xyz/')
        expect(link.label).toMatch(/download/i)
    })

    it('never tells a reader to strip the quarantine flag', () => {
        // Apple's Open Anyway override is the supported path and leaves the
        // decision inside a system dialog. `xattr -dr com.apple.quarantine` is
        // the same instruction an attacker wants a reader trained to obey, and
        // a portfolio page is exactly where that training would come from.
        expect(raw).not.toMatch(/xattr/i)
    })
})
