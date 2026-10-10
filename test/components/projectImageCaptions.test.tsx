import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { render, within } from '@testing-library/react'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import ProjectDetails from '../../components/features/ProjectDetails/ProjectDetails'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import { contentItemSchema } from '../../lib/schemas'
import type { MarkdownData } from '../../types'

// Exercise frontmatter normalization and the component used by project/research
// routes together. Different alt and caption strings expose accidental reuse.
describe('project image captions through the shipped MDX pipeline', () => {
    let fixtureRoot: string

    beforeAll(() => {
        fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-captions-'))
        fs.mkdirSync(path.join(fixtureRoot, 'content', 'projects'), { recursive: true })
    })

    afterAll(() => fs.rmSync(fixtureRoot, { recursive: true, force: true }))

    const parseFixture = async (imageFields: string): Promise<MarkdownData> => {
        const file = path.join(fixtureRoot, 'content', 'projects', 'caption-fixture.mdx')
        fs.writeFileSync(file, `---\ntitle: Caption fixture\nsubtitle: Image metadata compatibility\n${imageFields}\n---\n\nA rendered MDX paragraph.\n`)
        const { metaData, mdxSource } = await parseMarkdownFile(file)
        if (!mdxSource) throw new Error('fixture serialization missing')
        return { slug: 'caption-fixture', metaData, mdxSource }
    }

    it('normalizes captions on thumbnails, mastheads, and gallery images', async () => {
        const project = await parseFixture(`thumbnail:
  src: ' photoshelter-main-menu.png '
  alt: ' Visible thumbnail features '
  caption: ' Thumbnail credit '
masthead:
  src: photoshelter-main-menu.png
  alt: Visible masthead features
  caption: ' Masthead credit '
images:
- src: photoshelter-main-menu.png
  alt: Visible gallery features
  caption: ' Gallery credit '
  position: ' top '
  scale: 1.2`)
        expect(project.metaData.thumbnail).toEqual({
            src: 'photoshelter-main-menu.png', alt: 'Visible thumbnail features', caption: 'Thumbnail credit',
        })
        expect(project.metaData.masthead?.caption).toBe('Masthead credit')
        expect(project.metaData.images?.[0]).toEqual({
            src: 'photoshelter-main-menu.png', alt: 'Visible gallery features', caption: 'Gallery credit',
            position: 'top', scale: 1.2,
        })
        const { container } = render(<ProjectDetails project={project} />)
        const figures = container.querySelectorAll('figure')
        expect(figures).toHaveLength(2)
        expect(within(figures[0]).getByRole('img')).toHaveAttribute('alt', 'Visible masthead features')
        expect(figures[0].querySelector('figcaption')).toHaveTextContent(/^Masthead credit$/)
        expect(within(figures[1]).getByRole('img')).toHaveAttribute('alt', 'Visible gallery features')
        expect(figures[1].querySelector('figcaption')).toHaveTextContent(/^Gallery credit$/)
    })

    it('keeps legacy alt fallback for both mastheads and gallery images', async () => {
        const project = await parseFixture(`masthead:
  src: photoshelter-main-menu.png
  alt: Legacy masthead credit
images:
- src: photoshelter-main-menu.png
  alt: Legacy gallery credit`)
        const { container } = render(<ProjectDetails project={project} />)
        expect(Array.from(container.querySelectorAll('figcaption'), el => el.textContent))
            .toEqual(['Legacy masthead credit', 'Legacy gallery credit'])
    })

    it('treats blank or non-string captions as absent during normalization', async () => {
        const project = await parseFixture(`masthead:
  src: photoshelter-main-menu.png
  alt: Blank caption fallback
  caption: '   '
images:
- src: photoshelter-main-menu.png
  alt: Non-string caption fallback
  caption: 42`)
        expect(project.metaData.masthead).not.toHaveProperty('caption')
        expect(project.metaData.images?.[0]).not.toHaveProperty('caption')
        const { container } = render(<ProjectDetails project={project} />)
        expect(Array.from(container.querySelectorAll('figcaption'), el => el.textContent))
            .toEqual(['Blank caption fallback', 'Non-string caption fallback'])
        expect(contentItemSchema.safeParse({
            title: 'Schema fixture', subtitle: 'Invalid caption',
            masthead: { src: 'image.png', alt: 'Features', caption: 42 },
        }).success).toBe(false)
    })

    it('renders the Texting Syria case and exhibition link without an image', async () => {
        const { metaData, mdxSource } = await parseMarkdownFile(
            path.join(process.cwd(), 'content', 'projects', 'texting-syria.mdx'))
        if (!mdxSource) throw new Error('case serialization missing')
        const { container } = render(<ProjectDetails project={{ slug: 'texting-syria', metaData, mdxSource }} />)
        expect(container.querySelector('figure')).toBeNull()
        expect(container.querySelector('a[href="https://photoville.com/projects/texting-syria/"]')).not.toBeNull()
        expect(container.querySelector('article')).toHaveTextContent('Liam Maloney')
    })
})
