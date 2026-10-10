import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import matter from 'gray-matter'

const { stripMdxComponents } = createRequire(import.meta.url)(
    '../../scripts/lib/strip-mdx-components.js',
) as { stripMdxComponents: (content: string) => string }

describe('research text exports preserve technical evidence', () => {
    it.each(['order-book', 'rotation-matrices'])('%s keeps every code fence and display equation', slug => {
        const { content } = matter(fs.readFileSync(
            path.join(process.cwd(), 'content/research', `${slug}.mdx`), 'utf8'))
        const output = stripMdxComponents(content)
        const fences = content.match(/^```[^\n]*\n[\s\S]*?^```/gm) ?? []
        const equations = content.match(/\$\$[\s\S]*?\$\$/g) ?? []
        expect(fences.length).toBeGreaterThan(0)
        expect(equations.length).toBeGreaterThan(0)
        for (const block of [...fences, ...equations]) expect(output).toContain(block)
        expect(output).not.toContain('<OrderBookProvider>')
    })

    it('unwraps the provider while preserving prose and literal JSX code', () => {
        const code = '```tsx\n<div>\n\n    <Widget />\n</div>\n```'
        const output = stripMdxComponents(`<OrderBookProvider>\n\nReadable explanation.\n\n${code}\n\n</OrderBookProvider>`)
        expect(output).toBe(`Readable explanation.\n\n${code}`)
    })

    it('retains labelled ASCII figures and About layout content', () => {
        const output = stripMdxComponents('<Intro><AboutCard title="Section">Text.</AboutCard></Intro>\n\n<AsciiScreen label="Two linked views">\n\n```text\n[A] -> [B]\n```\n\n</AsciiScreen>')
        expect(output).toContain('### Section\n\nText.')
        expect(output).toContain('```text\n[A] -> [B]\n```\n\n_Two linked views_')
        expect(output).not.toMatch(/<\/?(?:Intro|AboutCard|AsciiScreen)/)
    })
})
