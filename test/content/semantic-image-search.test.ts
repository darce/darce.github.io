import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { contentItemSchema } from '../../lib/schemas'

const file = path.join(process.cwd(), 'content/projects/semantic-image-search.mdx')

describe('Semantic Image Search case (QM-REPOSITION-01 s2)', () => {
    const raw = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    const { data, content } = matter(raw)

    it('exists with schema-valid frontmatter that sorts first', () => {
        expect(fs.existsSync(file)).toBe(true)
        expect(() => contentItemSchema.parse(data)).not.toThrow()
        expect(data.index).toBeLessThan(5)
        expect(data.title).toMatch(/Semantic Image Search/)
    })

    it('names every designed incomplete-truth state', () => {
        for (const state of [
            'no folder',
            'no matches',
            'model unavailable',
            'partial library',
            'unavailable volume',
            'experimental',
        ]) {
            expect(content.toLowerCase()).toContain(state)
        }
    })

    it('declares screenshots as pending instead of faking them', () => {
        expect(content).toMatch(/Screens:\s*pending/i)
        expect(data.images ?? []).toHaveLength(0)
    })

    it('keeps the external-user evaluation gap explicit and avoids inflated claims', () => {
        expect(content).toMatch(/not yet run/i)
        expect(content).not.toMatch(/\b(validated|adoption|users love|seamless|leverage)\b/i)
    })
})
