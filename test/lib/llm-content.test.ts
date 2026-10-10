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
