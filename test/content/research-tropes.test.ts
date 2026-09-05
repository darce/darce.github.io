import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

// The public vet tool flags em-dash density, comma-grouped record counts,
// and counted headers long before they read as habits. These are style rules
// applied to every research entry, so they survive rewrites of the prose.
// Scoped to the prose entries these rules were written for. The list names
// files, not copy, so it survives a rewrite; the appendix pages (drawing
// references, worked maths) are excluded because counts and dashes are the
// subject there rather than a habit.
const researchDir = path.join(process.cwd(), 'content/research')
const slugs = [
    'agent-memory',
    'interrogating-agent-memory',
    'economics-of-agent-memory',
    'heuristics-canon',
]

const read = (slug: string) =>
    fs.readFileSync(path.join(researchDir, `${slug}.mdx`), 'utf8')

describe('research entries stay concept-first', () => {
    it.each(slugs)('%s keeps em-dashes at or below two', (slug) => {
        const count = (read(slug).match(/—/g) ?? []).length
        expect(count).toBeLessThanOrEqual(2)
    })

    it.each(slugs)('%s carries no comma-grouped record counts', (slug) => {
        // 58,838 vectors meant nothing out of context and changed daily;
        // proportions and orders of magnitude age, absolute counts rot.
        expect(read(slug)).not.toMatch(/\b\d{1,3}(?:,\d{3})+\b/)
    })

    it.each(slugs)('%s never links a chat transcript as evidence', (slug) => {
        expect(read(slug)).not.toMatch(/chatgpt\.com|claude\.ai\/share/i)
    })

    it.each(slugs)('%s names no embedding model in place of the concept', (slug) => {
        expect(read(slug)).not.toMatch(/gte-base|768[- ]dim/i)
    })

    it.each(slugs)('%s claims no cost-free outcome', (slug) => {
        expect(read(slug)).not.toMatch(/costs nothing|costless|zero[- ]cost/i)
    })

    it.each(slugs)('%s does not argue against its own drafting history', (slug) => {
        // A reader has not seen the earlier version, so referring to it
        // spends a sentence on an argument only the author can follow.
        expect(read(slug)).not.toMatch(
            /registered claim|previous draft|earlier phrase|pre-registered/i
        )
    })

    it.each(slugs)('%s scopes itself in prose, not a what-this-is block', (slug) => {
        expect(read(slug)).not.toMatch(/What this is:|What this is not:/)
    })

    it('every referenced diagram ships in public/', () => {
        const missing: string[] = []
        for (const slug of slugs) {
            for (const match of read(slug).matchAll(/src="([^"?]+)(?:\?[^"]*)?"/g)) {
                const asset = match[1]
                if (!asset.startsWith('/')) continue
                if (!fs.existsSync(path.join(process.cwd(), 'public', asset))) {
                    missing.push(`${slug} -> ${asset}`)
                }
            }
        }
        expect(missing).toEqual([])
    })
})
