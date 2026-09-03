import { describe, it, expect } from 'vitest'
import { SITE_TITLE, SITE_DESCRIPTION, personJsonLd } from '../../lib/seo'

const STALE = /Design\sTechnologist|Front-End Architecture|AltContext/i

describe('site positioning (QM-REPOSITION-01 s1)', () => {
    it('title states the product-engineer identity', () => {
        expect(SITE_TITLE).toBe('Daniel Arcé — Product Engineer')
        expect(SITE_TITLE).not.toMatch(/Product Designer/)
    })

    it('description leads with product engineer', () => {
        expect(SITE_DESCRIPTION).toMatch(/^Product engineer/)
        expect(SITE_DESCRIPTION).not.toMatch(STALE)
    })

    it('JSON-LD jobTitle matches the new identity', () => {
        expect(personJsonLd.jobTitle).toBe('Product Engineer')
        expect(personJsonLd.knowsAbout).toEqual(
            expect.arrayContaining(['Interaction design', 'Human-AI interaction', 'Semantic search']),
        )
        expect(JSON.stringify(personJsonLd)).not.toMatch(STALE)
    })
})
