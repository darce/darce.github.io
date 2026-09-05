import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const mastheadPath = path.join(process.cwd(), 'content/header/masthead.mdx')
const footerPath = path.join(process.cwd(), 'content/footer/footer.mdx')
const seoPath = path.join(process.cwd(), 'lib/seo.ts')
const workPath = path.join(process.cwd(), 'pages/work.tsx')

describe('site identity (Product Designer & Design Technologist)', () => {
    it('masthead subtitle names the role and practices', () => {
        const raw = fs.readFileSync(mastheadPath, 'utf8')
        const { data } = matter(raw)
        expect(data.subtitle).toBe('Product Designer & Design Technologist\nProduct R&D, prototyping, accessibility')
    })

    it('footer is utility chrome, not a second bio', () => {
        const raw = fs.readFileSync(footerPath, 'utf8')
        // The masthead already names the role on every page; a footer thesis
        // would restate it directly beneath the hero (WRIT-40).
        expect(raw).toContain('](/privacy/)')
        expect(raw).toContain('mailto:daniel.arce@gmail.com')
        expect(raw).not.toMatch(/product engineer\./i)
    })

    it('no MDX links a local file that is not in public/', () => {
        // The résumé PDF went stale in place and stayed linked from every page.
        // Nothing should point at a root-relative file the export does not ship.
        const contentDir = path.join(process.cwd(), 'content')
        const walk = (dir: string): string[] =>
            fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
                const full = path.join(dir, entry.name)
                if (entry.isDirectory()) return walk(full)
                return entry.name.endsWith('.mdx') ? [full] : []
            })

        const missing: string[] = []
        for (const file of walk(contentDir)) {
            const raw = fs.readFileSync(file, 'utf8')
            for (const match of raw.matchAll(/\((\/[^)\s]+\.[a-z0-9]{2,4})\)/gi)) {
                const asset = match[1]
                if (!fs.existsSync(path.join(process.cwd(), 'public', asset))) {
                    missing.push(`${path.relative(process.cwd(), file)} -> ${asset}`)
                }
            }
        }
        expect(missing).toEqual([])
    })

    it('masthead and search metadata agree on the role', () => {
        const role = 'Product Designer & Design Technologist'
        expect(fs.readFileSync(mastheadPath, 'utf8')).toContain(role)
        expect(fs.readFileSync(seoPath, 'utf8')).toContain(role)
        expect(fs.readFileSync(seoPath, 'utf8')).not.toContain('Product Engineer')
    })

    it('work metadata uses the current role and product name', () => {
        const raw = fs.readFileSync(workPath, 'utf8')
        expect(raw).toContain('Product design and design technology work by Daniel Arcé')
        expect(raw).toContain('Visual Search Workbench')
        expect(raw).not.toContain('Product design and design-technology')
        expect(raw).not.toContain('Semantic Image Search')
    })
})
