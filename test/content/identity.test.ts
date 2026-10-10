import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import matter from 'gray-matter'
import { allContentFiles, expectPublicAssetExists } from '../support/content'

describe('source content assets', () => {
    it.each(allContentFiles)('%s references existing metadata media and local links', file => {
        const { data, content } = matter(fs.readFileSync(file, 'utf8'))
        const images = [data.thumbnail, data.masthead, ...(data.images ?? [])].filter(Boolean)
        for (const image of images) {
            expect(image.alt, `image alternative in ${file}`).toEqual(expect.any(String))
            expectPublicAssetExists(`/images/${image.src.trim()}`)
        }
        for (const match of content.matchAll(/(?:\]\(|src=["'])(\/images\/[^)"'\s]+)/g)) {
            expectPublicAssetExists(match[1])
        }
    })
})
