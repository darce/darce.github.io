import { describe, it, expect } from 'vitest'
import {
    baseMetaSchema,
    contentItemSchema,
    headerSchema,
    aboutSchema,
    passthroughSchema,
    sectionSchemas,
} from '../../lib/schemas'

describe('contentItemSchema', () => {
    it('accepts valid project metadata', () => {
        const result = contentItemSchema.safeParse({
            title: 'My Project',
            subtitle: 'A subtitle',
            index: 10,
        })
        expect(result.success).toBe(true)
    })

    it('rejects missing title', () => {
        const result = contentItemSchema.safeParse({
            subtitle: 'A subtitle',
        })
        expect(result.success).toBe(false)
    })

    it('rejects missing subtitle', () => {
        const result = contentItemSchema.safeParse({
            title: 'A title',
        })
        expect(result.success).toBe(false)
    })

    it('rejects empty title', () => {
        const result = contentItemSchema.safeParse({
            title: '   ',
            subtitle: 'A subtitle',
        })
        expect(result.success).toBe(false)
    })

    it('accepts optional fields', () => {
        const result = contentItemSchema.safeParse({
            title: 'Project',
            subtitle: 'Sub',
            description: 'Description',
            details: 'Details',
            year: 2024,
            index: 1,
            tags: ['React', 'TypeScript'],
            links: [{ url: 'https://example.com', label: 'Example' }],
            images: [{ src: 'image.png', alt: 'Alt text' }],
        })
        expect(result.success).toBe(true)
    })

    it('rejects invalid link (missing url)', () => {
        const result = contentItemSchema.safeParse({
            title: 'Project',
            subtitle: 'Sub',
            links: [{ url: '', label: 'Example' }],
        })
        expect(result.success).toBe(false)
    })
})

describe('headerSchema', () => {
    it('requires title and subtitle', () => {
        const valid = headerSchema.safeParse({
            title: 'Daniel Arce',
            subtitle: 'Product Engineer',
        })
        expect(valid.success).toBe(true)

        const invalid = headerSchema.safeParse({ title: 'Daniel' })
        expect(invalid.success).toBe(false)
    })
})

describe('aboutSchema', () => {
    it('requires at least one image', () => {
        const valid = aboutSchema.safeParse({
            images: [{ src: 'headshot.jpg', alt: 'Portrait' }],
        })
        expect(valid.success).toBe(true)

        const invalid = aboutSchema.safeParse({})
        expect(invalid.success).toBe(false)
    })

    it('rejects images with empty src', () => {
        const result = aboutSchema.safeParse({
            images: [{ src: '', alt: 'Alt' }],
        })
        expect(result.success).toBe(false)
    })
})

describe('baseMetaSchema', () => {
    it('accepts empty object (all fields optional)', () => {
        const result = baseMetaSchema.safeParse({})
        expect(result.success).toBe(true)
    })

    it('rejects non-finite numbers', () => {
        const result = baseMetaSchema.safeParse({ index: Infinity })
        expect(result.success).toBe(false)
    })
})

describe('passthroughSchema', () => {
    it('accepts any object shape', () => {
        const result = passthroughSchema.safeParse({
            experience: [{ position: 'Dev' }],
            education: [{ school: 'NYU' }],
        })
        expect(result.success).toBe(true)
    })
})

describe('sectionSchemas', () => {
    it('maps known sections to schemas', () => {
        expect(sectionSchemas).toHaveProperty('projects')
        expect(sectionSchemas).toHaveProperty('research')
        expect(sectionSchemas).toHaveProperty('header')
        expect(sectionSchemas).toHaveProperty('about')
        expect(sectionSchemas).toHaveProperty('resume')
        expect(sectionSchemas).toHaveProperty('footer')
    })
})
