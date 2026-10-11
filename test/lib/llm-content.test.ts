import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
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
