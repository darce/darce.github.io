import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
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

// Real MDX serialization catches highlight spans, JSX escaping, and renderer
// registration failures that a test of a string-length helper would miss.
describe('article code preserves literal evidence and chooses width by content', () => {
    it('keeps short blocks intrinsic and near-80-column blocks wide in source order', async () => {
        const root = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-code-'))
        try {
            fs.mkdirSync(path.join(root, 'content', 'research'), { recursive: true })
            const samples = [
                'const markup = "<Widget />"',
                'x'.repeat(67), 'x'.repeat(71), 'x'.repeat(79),
                'x'.repeat(81), 'x'.repeat(92), '\t' + 'x'.repeat(65),
            ]
            const file = path.join(root, 'content', 'research', 'fixture.mdx')
            fs.writeFileSync(file, matter.stringify(samples.map(code => '```typescript\n' + code + '\n```\n\nFollowing copy.').join('\n\n'), { title, subtitle, articleLayout: 'flow' }))
            const { metaData, mdxSource } = await parseMarkdownFile(file)
            if (!mdxSource) throw new Error('Missing serialized code')
            const { container } = render(<ProjectDetails project={{ slug: 'fixture', metaData, mdxSource }} />)
            const blocks = Array.from(container.querySelectorAll('pre'))
            expect(blocks).toHaveLength(samples.length)
            expect(blocks.map(block => block.textContent)).toEqual(samples.map(code => code + '\n'))
            expect(blocks.map(block => block.getAttribute('data-code-layout'))).toEqual(['intrinsic', 'intrinsic', 'wide', 'wide', 'wide', 'wide', 'wide'])
            expect(blocks.map(block => block.getAttribute('data-code-columns'))).toEqual(['27', '67', '71', '79', '81', '92', '69'])
            for (const block of blocks) {
                expect(block).toHaveAttribute('tabindex', '0')
                expect(block.nextElementSibling?.textContent).toBe('Following copy.')
            }
        } finally {
            fs.rmSync(root, { recursive: true, force: true })
        }
    })
})

describe('the seven research articles compile through the production renderer', () => {
    it.each(['agent-memory', 'visual-search-workbench-process', 'interrogating-agent-memory', 'economics-of-agent-memory', 'heuristics-canon', 'rotation-matrices', 'order-book'])('%s keeps authored code and diagram evidence', async slug => {
        const file = path.join(process.cwd(), 'content/research', slug + '.mdx')
        const { metaData, mdxSource } = await parseMarkdownFile(file)
        if (!mdxSource) throw new Error('Missing article serialization')
        const source = matter(fs.readFileSync(file, 'utf8')).content
        const fences = [...source.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(match => match[1])
        const container = document.createElement('div')
        container.innerHTML = renderToStaticMarkup(<ProjectDetails project={{ slug, metaData, mdxSource }} />)
        expect(container.querySelector('[data-article-body]')).toHaveAttribute('data-article-layout', 'flow')
        expect(Array.from(container.querySelectorAll('pre')).map(pre => pre.textContent)).toEqual(fences)
        const diagrams = [...source.matchAll(/<Diagram\b[^>]*\balt="([^"]*)"[^>]*\bcaption="([^"]*)"/g)]
        for (const [, alt, caption] of diagrams) {
            const image = within(container).getByRole('img', { name: alt })
            expect(image.closest('figure')?.querySelector('figcaption')?.textContent).toBe(caption)
            const localSource = image.getAttribute('src')!.split('?')[0]
            const svg = fs.readFileSync(path.join(process.cwd(), 'public', localSource), 'utf8')
            const root = svg.match(/<svg\b[^>]*>/)![0]
            expect(image).toHaveAttribute('width', root.match(/\bwidth="([\d.]+)"/)![1])
            expect(image).toHaveAttribute('height', root.match(/\bheight="([\d.]+)"/)![1])
        }
        for (const [, alternative] of source.matchAll(/<SearchWorkflow\b[^>]*\blabel="([^"]*)"/g)) {
            expect(within(container).getByRole('img', { name: alternative })).toHaveAttribute('aria-label', alternative)
        }
    })
})
