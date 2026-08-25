import { describe, it, expect } from 'vitest'
import { cardIconFor } from '../../pages/index'
import type { ContentIndexData } from '../../types'

const project = (metaData: ContentIndexData['metaData']): ContentIndexData => ({
    slug: 'fixture',
    metaData,
})

describe('cardIconFor (homepage featured card icon)', () => {
    it('prefers the thumbnail over the masthead', () => {
        const icon = cardIconFor(
            project({
                thumbnail: { src: 'sis-results-grid.png', alt: 'Ranked results grid' },
                masthead: { src: 'blossfeldt-plate.jpg', alt: 'Karl Blossfeldt, Urformen der Kunst (1928)' },
            }),
        )
        expect(icon?.src).toBe('sis-results-grid.png')
    })

    it('falls back to the masthead when no thumbnail is set', () => {
        const icon = cardIconFor(project({ masthead: { src: 'blossfeldt-plate.jpg', alt: 'plate' } }))
        expect(icon?.src).toBe('blossfeldt-plate.jpg')
    })

    it('skips an animated thumbnail in favour of a still image', () => {
        const icon = cardIconFor(
            project({
                thumbnail: { src: 'keyboard-nav.gif', alt: 'Keyboard navigation' },
                masthead: { src: 'plate.jpg', alt: 'plate' },
            }),
        )
        expect(icon?.src).toBe('plate.jpg')
    })

    it('returns undefined when the project declares no media', () => {
        expect(cardIconFor(project({}))).toBeUndefined()
    })
})
