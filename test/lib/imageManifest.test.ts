import { describe, expect, it, vi } from 'vitest'

vi.mock('../../lib/generated/image-manifest.json', () => ({ default: {} }))

import { pickFallbackSrc, toSrcSet } from '../../lib/imageManifest'

describe('toSrcSet', () => {
    it('returns an empty string for an empty candidate list', () => {
        expect(toSrcSet([])).toBe('')
    })

    it('formats candidates as a comma-separated srcset', () => {
        expect(toSrcSet([
            { w: 320, src: 'a' },
            { w: 640, src: 'b' },
        ])).toBe('a 320w, b 640w')
    })
})

describe('pickFallbackSrc', () => {
    const candidates = [
        { w: 320, src: 'small' },
        { w: 480, src: 'medium' },
        { w: 960, src: 'large' },
    ]

    it('returns undefined for an empty candidate list', () => {
        expect(pickFallbackSrc([])).toBeUndefined()
    })

    it('picks the smallest candidate at or above the target', () => {
        expect(pickFallbackSrc(candidates)).toBe('large')
    })

    it('picks the largest candidate when the target exceeds all widths', () => {
        expect(pickFallbackSrc(candidates, 2000)).toBe('large')
    })

    it('sorts candidates before selecting a fallback', () => {
        expect(pickFallbackSrc([
            { w: 960, src: 'large' },
            { w: 320, src: 'small' },
            { w: 480, src: 'medium' },
        ], 400)).toBe('medium')
    })
})
