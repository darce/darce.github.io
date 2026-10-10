import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render, within } from '@testing-library/react'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import matter from 'gray-matter'
import ProjectDetails from '../../components/features/ProjectDetails/ProjectDetails'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import { contentItemSchema } from '../../lib/schemas'
import manifest from '../../lib/generated/image-manifest.json'
import type { MarkdownData } from '../../types'

const src = Object.keys(manifest)[0]
const masthead = { src, alt: ' Visible masthead features ', caption: ' Masthead credit ' }
const gallery = { src, alt: ' Visible gallery features ', caption: ' Gallery credit ', position: ' top ', scale: 1.2 }
const title = 'Caption fixture'
const subtitle = 'Image metadata compatibility'

describe('image metadata through the real MDX pipeline', () => {
    let fixtureRoot: string
    beforeEach(() => {
        fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-captions-'))
        fs.mkdirSync(path.join(fixtureRoot, 'content', 'projects'), { recursive: true })
    })
    afterEach(() => fs.rmSync(fixtureRoot, { recursive: true, force: true }))

    const parseFixture = async (fields: Record<string, unknown>): Promise<MarkdownData> => {
        const file = path.join(fixtureRoot, 'content', 'projects', 'fixture.mdx')
        fs.writeFileSync(file, matter.stringify('A rendered paragraph.', { title, subtitle, ...fields }))
        const { metaData, mdxSource } = await parseMarkdownFile(file)
        if (!mdxSource) throw new Error('Fixture serialization missing')
        return { slug: path.basename(file, '.mdx'), metaData, mdxSource }
    }
    const expectFigures = (project: MarkdownData, expected: Array<{ alt: string; caption?: string }>) => {
        const { container } = render(<ProjectDetails project={project} />)
        const figures = Array.from(container.querySelectorAll('figure'))
        expect(figures).toHaveLength(expected.length)
        expected.forEach((image, index) => {
            expect(within(figures[index]).getByRole('img')).toHaveAttribute('alt', image.alt.trim())
            expect(figures[index].querySelector('figcaption')?.textContent).toBe((image.caption ?? image.alt).trim())
        })
        return container
    }
    it('keeps visual descriptions separate from captions and normalizes whitespace', async () => {
        const thumbnail = { ...masthead, caption: ' Thumbnail credit ' }
        const project = await parseFixture({ thumbnail, masthead, images: [gallery] })
        for (const [input, output] of [[thumbnail, project.metaData.thumbnail], [masthead, project.metaData.masthead], [gallery, project.metaData.images?.[0]]] as const) {
            expect(output?.src).toBe(input.src.trim())
            expect(output?.alt).toBe(input.alt.trim())
            expect(output?.caption).toBe(input.caption.trim())
        }
        expect(project.metaData.images?.[0].position).toBe(gallery.position.trim())
        expect(project.metaData.images?.[0].scale).toBe(gallery.scale)
        expectFigures(project, [masthead, gallery])
    })
    it('keeps legacy caption fallback when no caption was supplied', async () => {
        const legacyMasthead = { src: masthead.src, alt: masthead.alt }
        const legacyGallery = { src: gallery.src, alt: gallery.alt }
        expectFigures(await parseFixture({ masthead: legacyMasthead, images: [legacyGallery] }), [legacyMasthead, legacyGallery])
    })
    it('ignores blank and non-string captions during normalization but rejects their raw schema shape', async () => {
        const legacyMasthead = { src: masthead.src, alt: masthead.alt }
        const legacyGallery = { src: gallery.src, alt: gallery.alt }
        const fields = { masthead: { ...legacyMasthead, caption: '   ' }, images: [{ ...legacyGallery, caption: 42 }] }
        const project = await parseFixture(fields)
        expect(project.metaData.masthead).not.toHaveProperty('caption')
        expect(project.metaData.images?.[0]).not.toHaveProperty('caption')
        expect(contentItemSchema.safeParse({ title, subtitle, ...fields }).success).toBe(false)
        expectFigures(project, [legacyMasthead, legacyGallery])
    })
    it('renders image-free projects and their supplied action without requiring a gallery', async () => {
        const link = { url: 'https://exhibition.example/record/', label: 'Exhibition record' }
        const project = await parseFixture({ links: [link] })
        const container = expectFigures(project, [])
        expect(within(container).getByRole('link', { name: link.label })).toHaveAttribute('href', link.url)
    })
})
