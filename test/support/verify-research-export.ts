// Independent check of built HTML against authored evidence. This is scoped
// to the research revision and its pilot, with no browser/network dependency.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
const { JSDOM } = createRequire(import.meta.url)('jsdom') as { JSDOM: new (html: string) => { window: { document: Document } } }
import matter from 'gray-matter'
const root = fileURLToPath(new URL('../..', import.meta.url))
const slugs = ['agent-memory', 'visual-search-workbench-process', 'interrogating-agent-memory', 'economics-of-agent-memory', 'heuristics-canon', 'rotation-matrices', 'order-book']
for (const slug of slugs) {
    const source = matter(fs.readFileSync(path.join(root, 'content/research', slug + '.mdx'), 'utf8')).content
    const document = new JSDOM(fs.readFileSync(path.join(root, 'out/research', slug, 'index.html'), 'utf8')).window.document
    const article = document.querySelector('[data-article-body]')
    assert.equal(article?.getAttribute('data-article-layout'), 'flow', slug)
    assert.ok(article)
    const code = [...source.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(match => match[1])
    assert.deepEqual([...article.querySelectorAll('pre')].map(block => block.textContent), code, slug + ' code bytes/order')
    for (const [, alternative] of source.matchAll(/<(?:Diagram|Figure)\b[^>]*\balt="([^"]*)"/g)) {
        assert.ok([...article.querySelectorAll('img')].some(image => image.alt === alternative), slug + ' image alternative')
    }
    for (const [, alternative] of source.matchAll(/<SearchWorkflow\b[^>]*\blabel="([^"]*)"/g)) {
        assert.ok([...article.querySelectorAll('[data-workflow]')].some(figure => figure.getAttribute('aria-label') === alternative), slug + ' workflow alternative')
    }
    console.log('PASS', slug, code.length + ' complete code/UI blocks')
}
const pilot = new JSDOM(fs.readFileSync(path.join(root, 'out/research/visual-search-workbench-screen-reference/index.html'), 'utf8')).window.document
assert.equal(pilot.querySelectorAll('[data-flow-row="query"] [data-workflow="similar"]').length, 1)
assert.ok(pilot.querySelector('section[data-flow-layout="query"] figure[data-layout="wide"]'))
console.log('PASS pilot query row and wide evidence remain in source order')
