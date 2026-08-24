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

    it('embeds all eight ASCII screens while declaring pixel screenshots pending', () => {
        expect(data.images ?? []).toHaveLength(0)
        expect(content).toMatch(/Screenshots:\s*pending/i)
        expect(content).not.toMatch(/Screens:\s*pending/i)

        const textFences = content.match(/```text\n[\s\S]*?\n```/g) ?? []
        expect(textFences).toHaveLength(8)

        for (const distinctiveDrawingString of [
            'No folder yet',
            'Embedding 812 of 1,284',
            '64 search results',
            'IMG_4417.HEIC',
            'Showing 41 of 1,284 photos.',
            '312 photos were never opened',
            '3 photos dated before 1962 are off the left of this axis.',
            'Ask local Ollama to name unsure layers',
        ]) {
            expect(textFences.some((fence) => fence.includes(distinctiveDrawingString))).toBe(true)
        }

        for (let screen = 1; screen <= 8; screen += 1) {
            expect(content.split(`**Screen ${screen} — `)).toHaveLength(2)
        }

        expect(content).not.toMatch(/Figure pending/i)
    })

    it('keeps the external-user evaluation gap explicit and avoids inflated claims', () => {
        expect(content).toMatch(/not yet run/i)
        expect(content).not.toMatch(/\b(validated|adoption|users love|seamless|leverage)\b/i)
    })
})
