#!/usr/bin/env node
/**
 * Lightweight DOM inspector for Next.js pages.
 *
 * Fetches HTML from the dev server (default http://localhost:3000) or
 * falls back to built HTML in .next/server/pages/.
 *
 * Usage:
 *   npm run inspect -- <page> <selector> [flags]
 *
 * Examples:
 *   npm run inspect -- work nav                        # tree view (default)
 *   npm run inspect -- work "nav ul > li" --tree       # explicit tree
 *   npm run inspect -- work "nav ol li a" --attrs      # show attributes
 *   npm run inspect -- work "nav" --tree --depth=2     # limit depth
 *   npm run inspect -- index "header h1" --text        # text content
 *   npm run inspect -- work "nav ol" --outer           # raw HTML
 *   npm run inspect -- work "nav ol li" --count        # count matches
 *   npm run inspect -- /research nav --port=3001       # custom port
 *
 * Source:
 *   With `npm run dev` running, fetches from http://localhost:<port>/<page>.
 *   Without a dev server, reads from .next/server/pages/<page>.html
 *   (requires `npm run build` first).
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { JSDOM } from 'jsdom'

const args = process.argv.slice(2)
const flags = args.filter(a => a.startsWith('--'))
const positional = args.filter(a => !a.startsWith('--'))

const page = positional[0]
const selector = positional[1]

if (!page || !selector) {
    console.error('Usage: npm run inspect -- <page> <selector> [flags]')
    console.error('')
    console.error('Flags:')
    console.error('  --tree          Print DOM subtree (default if no other flag)')
    console.error('  --attrs         Show all attributes on matched elements')
    console.error('  --text          Show text content only')
    console.error('  --depth=N       Limit tree depth (default: unlimited)')
    console.error('  --count         Just count matches')
    console.error('  --outer         Print raw outerHTML')
    console.error('  --port=N        Dev server port (default: 3000)')
    process.exit(1)
}

const depthFlag = flags.find(f => f.startsWith('--depth='))
const maxDepth = depthFlag ? parseInt(depthFlag.split('=')[1], 10) : Infinity
const portFlag = flags.find(f => f.startsWith('--port='))
const port = portFlag ? parseInt(portFlag.split('=')[1], 10) : 3000
const showTree = flags.includes('--tree') || (!flags.some(f => ['--attrs', '--text', '--count', '--outer'].includes(f)))
const showAttrs = flags.includes('--attrs')
const showText = flags.includes('--text')
const showCount = flags.includes('--count')
const showOuter = flags.includes('--outer')

// Normalize page path: "work" -> "/work", "/work" stays "/work", "index" -> "/"
function normalizePath(p) {
    if (p === 'index') return '/'
    return p.startsWith('/') ? p : `/${p}`
}

/**
 * Try fetching from the dev server first, fall back to built HTML files.
 */
async function getHtml() {
    const pagePath = normalizePath(page)
    const url = `http://localhost:${port}${pagePath}`

    // Try dev server
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
        if (res.ok) {
            const html = await res.text()
            console.error(`(fetched from ${url})`)
            return html
        }
    } catch {
        // Dev server not running, fall back to files
    }

    // Fall back to built HTML
    let htmlPath = join('.next', 'server', 'pages', `${page}.html`)
    if (!existsSync(htmlPath)) {
        htmlPath = join('.next', 'server', 'pages', page, 'index.html')
    }
    if (!existsSync(htmlPath)) {
        htmlPath = join('.next', 'server', 'pages', page)
    }
    if (!existsSync(htmlPath)) {
        console.error(`Could not fetch from ${url} (dev server not running?)`)
        console.error(`Could not read .next/server/pages/${page}.html (run npm run build?)`)
        process.exit(1)
    }

    console.error(`(read from ${htmlPath})`)
    return readFileSync(htmlPath, 'utf-8')
}

const html = await getHtml()
const dom = new JSDOM(html)
const document = dom.window.document

const matches = document.querySelectorAll(selector)

if (matches.length === 0) {
    console.log(`No matches for "${selector}" in ${page}`)
    process.exit(0)
}

if (showCount) {
    console.log(`${matches.length} match${matches.length === 1 ? '' : 'es'}`)
    process.exit(0)
}

/**
 * Print a compact tree representation of a DOM node.
 */
function printTree(node, indent = 0, depth = 0) {
    if (depth > maxDepth) return

    const pad = '  '.repeat(indent)
    const tag = node.tagName?.toLowerCase()
    if (!tag) return

    // Build attribute summary
    const attrs = []
    if (node.id) attrs.push(`#${node.id}`)
    if (node.className) {
        // Shorten CSS module class names: keep only the last segment
        const classes = node.className.split(/\s+/).map(c => {
            const parts = c.split('__')
            return parts.length >= 3 ? `.${parts[parts.length - 1]}` : `.${c}`
        })
        attrs.push(classes.join(''))
    }
    for (const attr of ['aria-label', 'href', 'aria-current', 'data-path']) {
        const val = node.getAttribute(attr)
        if (val) attrs.push(`[${attr}="${val}"]`)
    }
    if (node.getAttribute('aria-hidden') === 'true') attrs.push('[aria-hidden]')
    if (node.getAttribute('aria-expanded')) attrs.push(`[aria-expanded="${node.getAttribute('aria-expanded')}"]`)
    const style = node.getAttribute('style')
    if (style) attrs.push(`[style="${style}"]`)

    // Inline text for leaf nodes
    const children = Array.from(node.children)
    const textOnly = children.length === 0 && node.textContent?.trim()

    let line = `${pad}<${tag}${attrs.join('')}>`
    if (textOnly) line += ` "${node.textContent.trim()}"`
    console.log(line)

    for (const child of children) {
        printTree(child, indent + 1, depth + 1)
    }
}

matches.forEach((el, i) => {
    if (matches.length > 1) {
        console.log(`--- match ${i + 1}/${matches.length} ---`)
    }

    if (showOuter) {
        console.log(el.outerHTML)
    } else if (showText) {
        console.log(el.textContent?.trim() || '(empty)')
    } else if (showAttrs) {
        const tag = el.tagName.toLowerCase()
        const attrList = Array.from(el.attributes).map(a => `  ${a.name}="${a.value}"`)
        console.log(`<${tag}>`)
        attrList.forEach(a => console.log(a))
    } else if (showTree) {
        printTree(el)
    }

    if (matches.length > 1 && i < matches.length - 1) console.log('')
})
