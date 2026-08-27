import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

// The public vet tool flags em-dash density, comma-grouped record counts,
// and counted headers long before they read as habits. These guards hold
// the memory entries at the level the 2026-08 rewrite brought them to.
const slugs = [
    'agent-memory',
    'interrogating-agent-memory',
    'economics-of-agent-memory',
    'heuristics-canon',
]

const read = (slug: string) =>
    fs.readFileSync(
        path.join(process.cwd(), `content/research/${slug}.mdx`),
        'utf8'
    )

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

    it('keeps the token claim causal, bounded, and genuinely randomized', () => {
        const economics = read('economics-of-agent-memory')
        expect(economics).toMatch(/random/i)
        expect(economics).toMatch(/same outcome|equal or better review pass rate/i)
        expect(economics).not.toMatch(/costs nothing|costless|zero[- ]cost/i)
    })

    it('frames the economics article around the settled cost and open benefit', () => {
        const economics = read('economics-of-agent-memory')
        expect(economics).toContain('[WorkBay](/projects/workbay/)')
        expect(economics).toContain('`require a controlled evaluation')
        expect(economics).toContain('about 99% of findings marked resolved carry a written resolution')
        expect(economics).toContain('<PullQuote>')
        expect(economics).not.toMatch(/p\s*[≈=]\s*0\.7|2026-12-31/)
    })

    it('states the economics contrast directly instead of using negative parallelism', () => {
        const economics = read('economics-of-agent-memory')
        expect(economics).not.toMatch(
            /not declaring victory|not the part of the ledger|That does not mean memory has no cost|describes the write path, not the benefit|registered claim|previous draft|earlier phrase|pre-registered/i
        )
    })

    it('frames the five-questions note as a WorkBay field note', () => {
        const note = read('interrogating-agent-memory')
        expect(note).toContain('[WorkBay](/projects/workbay/)')
        expect(note).toContain('<PullQuote>')
        expect(note).toMatch(/context window/i)
        expect(note).not.toMatch(/registered claim|previous draft|earlier phrase|pre-registered/i)
    })

    it('names the audit trail and cross-harness boundary without claiming free switching', () => {
        const memory = read('agent-memory')
        expect(memory).toMatch(/audit trail/i)
        expect(memory).toMatch(/harness/i)
        expect(memory).toMatch(/switching/i)
        expect(memory).not.toMatch(/costs nothing|costless|zero[- ]cost/i)
    })
})
