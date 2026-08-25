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

    it('footer is utility chrome, not a second bio', () => {
        const raw = fs.readFileSync(footerPath, 'utf8')
        // The masthead already names the role on every page; a footer thesis
        // would restate it directly beneath the hero (WRIT-40).
        expect(raw).toContain('](/daniel_arce_resume.pdf)')
        expect(raw).toContain('](/privacy/)')
        expect(raw).toContain('mailto:daniel.arce@gmail.com')
        expect(raw).not.toMatch(/design technologist\./i)
    })

    it('does not retain the two-headed identity string', () => {
        const retired = 'Product Designer & Design Technologist'
        expect(fs.readFileSync(mastheadPath, 'utf8')).not.toContain(retired)
        expect(fs.readFileSync(footerPath, 'utf8')).not.toContain(retired)
        expect(fs.readFileSync(seoPath, 'utf8')).not.toContain(retired)
    })
})
