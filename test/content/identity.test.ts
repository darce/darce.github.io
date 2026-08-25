import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const mastheadPath = path.join(process.cwd(), 'content/header/masthead.mdx')
const footerPath = path.join(process.cwd(), 'content/footer/footer.mdx')
const seoPath = path.join(process.cwd(), 'lib/seo.ts')

describe('site identity (Design Technologist)', () => {
    it('masthead subtitle is Design Technologist', () => {
        const raw = fs.readFileSync(mastheadPath, 'utf8')
        const { data } = matter(raw)
        expect(data.subtitle).toBe('Design Technologist')
    })

    it('footer leads with Design technologist', () => {
        const raw = fs.readFileSync(footerPath, 'utf8')
        expect(raw).toMatch(/^Design technologist\./)
    })

    it('does not retain the two-headed identity string', () => {
        const retired = 'Product Designer & Design Technologist'
        expect(fs.readFileSync(mastheadPath, 'utf8')).not.toContain(retired)
        expect(fs.readFileSync(footerPath, 'utf8')).not.toContain(retired)
        expect(fs.readFileSync(seoPath, 'utf8')).not.toContain(retired)
    })
})
