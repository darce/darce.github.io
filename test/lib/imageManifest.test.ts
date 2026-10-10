import { describe, expect, it } from 'vitest'
import { getImageEntry, pickFallbackSrc, toSrcSet } from '../../lib/imageManifest'
import manifest from '../../lib/generated/image-manifest.json'

const candidates = [
    { w: 320, src: 'small' }, { w: 480, src: 'medium' }, { w: 960, src: 'large' },
]

describe('responsive image data', () => {
    it('resolves generated entries with leading slash or query parameters', () => {
        const [src, entry] = Object.entries(manifest)[0]
        expect(getImageEntry(src)).toEqual(entry)
        expect(getImageEntry(`/${src}?preview=1`)).toEqual(entry)
        expect(getImageEntry('a-missing-image.png')).toBeUndefined()
    })
    it('formats source candidates using their declared widths', () => {
        const parsed = toSrcSet(candidates).split(',').map(value => {
            const match = value.trim().match(/^(\S+)\s+(\d+)w$/)
            expect(match).not.toBeNull()
            return { src: match![1], w: Number(match![2]) }
        })
        expect(parsed).toEqual(candidates)
        expect(toSrcSet([])).toBe('')
    })
    it('selects the smallest adequate candidate independently of input order', () => {
        const target = candidates[0].w + 1
        expect(pickFallbackSrc([...candidates].reverse(), target)).toBe(candidates[1].src)
    })
    it('uses the largest candidate above the available range and tolerates an empty manifest entry', () => {
        expect(pickFallbackSrc(candidates, candidates.at(-1)!.w + 1)).toBe(candidates.at(-1)!.src)
        expect(pickFallbackSrc([])).toBeUndefined()
    })
})
