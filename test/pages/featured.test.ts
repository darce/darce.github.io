import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { FEATURED_SLUGS, FEATURED_METRICS } from '../../pages/index'

describe('homepage featured order (QM-REPOSITION-01 s3)', () => {
    it('orders evidence VSW → AltContext → PhotoShelter → WorkBay', () => {
        expect(FEATURED_SLUGS).toEqual(['visual-search-workbench', 'altcontext', 'photoshelter', 'workbay'])
    })

    it('every featured slug has a blurb and a content file', () => {
        expect(Object.keys(FEATURED_METRICS)).toEqual(FEATURED_SLUGS)
        for (const slug of FEATURED_SLUGS) {
            expect(FEATURED_METRICS[slug]).toBeTruthy()
            expect(fs.existsSync(path.join(process.cwd(), 'content/projects', `${slug}.mdx`))).toBe(true)
        }
    })
})
