import { describe, expect, it } from 'vitest'
import { getMdxIndexContent } from '../../lib/getMdxContent'

const VISUAL_EXPLORATION_SLUGS = [
    'visual-search-workbench-process',
    'visual-search-workbench-screen-reference',
]

describe('research thumbnails', () => {
    it('uses a distinct thumbnail for every research entry', async () => {
        const entries = (await getMdxIndexContent({ subDir: 'research' })).parsedMdxArray
        const visualExploration = VISUAL_EXPLORATION_SLUGS.map((slug) =>
            entries.find((entry) => entry.slug === slug),
        )

        expect(visualExploration.every(Boolean)).toBe(true)

        const entriesWithThumbnails = entries.filter((entry) => entry.metaData.thumbnail?.src)
        const thumbnailSrcs = entriesWithThumbnails.map((entry) => entry.metaData.thumbnail?.src)
        expect(new Set(thumbnailSrcs).size).toBe(thumbnailSrcs.length)

        const visualThumbnailSrcs = visualExploration.map((entry) => entry?.metaData.thumbnail?.src)
        expect(new Set(visualThumbnailSrcs).size).toBe(VISUAL_EXPLORATION_SLUGS.length)
    })
})
