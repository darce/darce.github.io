import { describe, expect, it } from 'vitest'
import { cardIconFor } from '../../pages/index'
import type { ContentIndexData } from '../../types'

const project = (metaData: ContentIndexData['metaData']): ContentIndexData => ({ slug: 'fixture', metaData })
const thumbnail = { src: 'thumbnail.png', alt: 'Thumbnail input' }
const masthead = { src: 'masthead.jpg', alt: 'Masthead input' }
const animation = { src: 'motion.gif', alt: 'Animated input' }

describe('featured icon selection', () => {
    it('prefers a still thumbnail over other media', () => {
        expect(cardIconFor(project({ thumbnail, masthead }))).toEqual(thumbnail)
    })
    it('uses the masthead when the thumbnail is absent', () => {
        expect(cardIconFor(project({ masthead }))).toEqual(masthead)
    })
    it('prefers still media over an animated thumbnail', () => {
        expect(cardIconFor(project({ thumbnail: animation, masthead }))).toEqual(masthead)
    })
    it('uses gallery media when neither preferred slot is present', () => {
        expect(cardIconFor(project({ images: [thumbnail] }))).toEqual(thumbnail)
    })
    it('keeps an animation usable when it is the only media', () => {
        expect(cardIconFor(project({ thumbnail: animation }))).toEqual(animation)
    })
    it('allows a project without media', () => {
        expect(cardIconFor(project({}))).toBeUndefined()
    })
})
