import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import vm from 'node:vm'
import matter from 'gray-matter'
import { createRequire } from 'node:module'
import { allContentFiles, articles } from '../support/content'
import { buildItemPath } from '../../lib/routes'

const { stripMdxComponents } = createRequire(import.meta.url)('../../scripts/lib/strip-mdx-components.js') as { stripMdxComponents: (content: string) => string }
const full = fs.readFileSync(path.join(process.cwd(), 'public/llms-full.txt'), 'utf8')
const index = fs.readFileSync(path.join(process.cwd(), 'public/llms.txt'), 'utf8')

describe('generated text exports reflect the current source inventory', () => {
    it('unwraps nested layout containers and preserves literal HTML examples', () => {
        const example = '```html\n<div>Example markup</div>\n```'
        const source = '<section>\n<div data-flow-row="query">\n<div>Inspect the photograph.</div>\nFollow the diagram.\n</div>\n</section>\n\n' + example
        const text = stripMdxComponents(source)
        expect(text).toContain('Inspect the photograph.')
        expect(text).toContain('Follow the diagram.')
        expect(text).toContain(example)
        expect(text.replace(example, '')).not.toMatch(/<\/?(?:section|div)\b/)
    })
    it('preserves workflow meaning and captions for readers of the text export', () => {
        const source = '<SearchWorkflow kind="similar" label="Open a photograph, choose Find similar, and return with Back to text results.">Schematic: the chosen photograph remains the reference.</SearchWorkflow>'
        const text = stripMdxComponents(source)
        expect(text).toContain('Open a photograph, choose Find similar, and return with Back to text results.')
        expect(text).toContain('Schematic: the chosen photograph remains the reference.')
        expect(text).not.toMatch(/SearchWorkflow|kind=|label=/)
    })
    it('keeps inset figure evidence and its explanation in the text alternative', () => {
        const source = '<Figure src="menu.gif" alt="Focus moving through a menu" caption="Keyboard navigation." width={640} height={446} inspectable>\n\nFocus must cross component boundaries.\n\n</Figure>'
        const text = stripMdxComponents(source)
        expect(text).toContain('![Focus moving through a menu](/images/menu.gif)')
        expect(text).toContain('*Keyboard navigation.*')
        expect(text).toContain('Focus must cross component boundaries.')
        expect(text).not.toMatch(/<\/?Figure\b|width=|inspectable/)
    })
    it.each(articles)('$section/$slug retains its metadata, body, technical examples, and diagram alternatives', ({ file, section, slug }) => {
        const { data, content } = matter(fs.readFileSync(file, 'utf8'))
        expect(index).toContain(buildItemPath(section, slug) + '/')
        expect(index).toContain(data.description ?? data.title)
        expect(full).toContain(`### ${data.title}`)
        expect(full).toContain(data.subtitle)
        if (data.details) expect(full).toContain(data.details)
        expect(full).toContain(stripMdxComponents(content).trim())
        const evidence = [...(content.match(/^```[^\n]*\n[\s\S]*?^```/gm) ?? []), ...(content.match(/\$\$[\s\S]*?\$\$/g) ?? [])]
        for (const block of evidence) expect(full).toContain(block)
    })
    it('retains the About body rather than only its wrapper or an arbitrary character count', () => {
        const about = allContentFiles.find(file => path.basename(path.dirname(file)) === 'about')!
        const { content } = matter(fs.readFileSync(about, 'utf8'))
        expect(full).toContain(stripMdxComponents(content).trim())
        expect(full).not.toMatch(/<\/?(?:AsciiScreen|Intro|AboutCard|PullQuote)\b/)
    })
})

it('preserves existing diagram alternatives, paired diagrams, and their captions', () => {
    const source = '<DiagramPair>\n<Diagram src="/images/research/rotation-ccw.svg?v=7" alt="Positive turn with y up" caption="A geometric convention, not a measurement." />\n<Diagram src="/images/research/rotation-cw.svg?v=7" alt="Same turn with screen y down" />\n</DiagramPair>'
    const text = stripMdxComponents(source)
    expect(text).toContain('![Positive turn with y up](/images/research/rotation-ccw.svg?v=7)')
    expect(text).toContain('*A geometric convention, not a measurement.*')
    expect(text).toContain('![Same turn with screen y down](/images/research/rotation-cw.svg?v=7)')
    expect(text).not.toMatch(/DiagramPair|<Diagram/)
})


it('test-only generation updates text exports idempotently without touching the sitemap', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-export-'))
    try {
        for (const dir of ['scripts/lib', 'lib', 'public', 'content/research']) fs.mkdirSync(path.join(root, dir), { recursive: true })
        for (const file of ['scripts/generate-llm-content.js', 'scripts/lib/strip-mdx-components.js', 'lib/siteMeta.json']) fs.copyFileSync(file, path.join(root, file))
        fs.writeFileSync(path.join(root, 'public/sitemap.xml'), 'canonical sitemap sentinel')
        fs.writeFileSync(path.join(root, 'content/research/example.mdx'), '---\ntitle: Fresh article\nsubtitle: Export check\n---\nFresh evidence.')
        const nodeRequire = createRequire(import.meta.url)
        const generate = (...args: string[]) => vm.runInNewContext(fs.readFileSync('scripts/generate-llm-content.js', 'utf8'), {
            __dirname: path.join(root, 'scripts'), process: { argv: ['node', 'generator', ...args] }, console,
            require: (id: string) => id === 'child_process' ? { execSync: () => '2026-01-01' }
                : id.startsWith('.') ? nodeRequire(path.resolve(root, 'scripts', id)) : nodeRequire(id),
        })
        generate('--skip-sitemap')
        const first = fs.readFileSync(path.join(root, 'public/llms-full.txt'), 'utf8')
        expect(first).toContain('Fresh evidence.')
        generate('--skip-sitemap')
        expect(fs.readFileSync(path.join(root, 'public/llms-full.txt'), 'utf8')).toBe(first)
        expect(fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8')).toBe('canonical sitemap sentinel')
        generate()
        expect(fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8')).toContain('/research/example/')
    } finally {
        fs.rmSync(root, { recursive: true, force: true })
    }
})
