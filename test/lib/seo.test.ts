import { describe, it, expect } from 'vitest'
import { SITE_TITLE, SITE_DESCRIPTION, personJsonLd } from '../../lib/seo'

const STALE = /Front-End Architecture|AltContext/i

describe('site positioning (QM-REPOSITION-01 s1)', () => {
    it('title states the product-designer and design-technologist identity', () => {
        expect(SITE_TITLE).toBe('Daniel Arcé — Product Designer & Design Technologist')
        expect(SITE_TITLE).not.toMatch(/Product Engineer/)
    })

    it('description leads with product design', () => {
        expect(SITE_DESCRIPTION).toMatch(/^Product designer and design technologist/)
        expect(SITE_DESCRIPTION).not.toMatch(STALE)
    })

    it('JSON-LD jobTitle matches the new identity', () => {
        expect(personJsonLd.jobTitle).toBe('Product Designer & Design Technologist')
        expect(personJsonLd.knowsAbout).toEqual(
            expect.arrayContaining(['Interaction design', 'Human-AI interaction', 'Semantic search']),
        )
        expect(JSON.stringify(personJsonLd)).not.toMatch(STALE)
    })
})
