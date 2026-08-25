import { describe, it, expect } from 'vitest'
import { SITE_TITLE, SITE_DESCRIPTION, personJsonLd } from '../../lib/seo'

const STALE = /Product Engineer|Front-End Architecture|AltContext/i

describe('site positioning (QM-REPOSITION-01 s1)', () => {
    it('title states the design-technologist identity', () => {
        expect(SITE_TITLE).toBe('Daniel Arcé — Design Technologist')
        expect(SITE_TITLE).not.toMatch(/Product Designer/)
    })

    it('description leads with design technologist, not engineering', () => {
        expect(SITE_DESCRIPTION).toMatch(/^Design technologist/)
        expect(SITE_DESCRIPTION).not.toMatch(STALE)
    })

    it('JSON-LD jobTitle matches the new identity', () => {
        expect(personJsonLd.jobTitle).toBe('Design Technologist')
        expect(personJsonLd.knowsAbout).toEqual(
            expect.arrayContaining(['Interaction design', 'Human-AI interaction', 'Semantic search']),
        )
        expect(JSON.stringify(personJsonLd)).not.toMatch(STALE)
    })
})
