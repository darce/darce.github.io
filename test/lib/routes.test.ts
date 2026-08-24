import { describe, it, expect } from 'vitest'
import { buildItemPath, resolveNavPath, NAV_ITEMS } from '../../lib/routes'

describe('buildItemPath', () => {
    it('builds a path from section and slug', () => {
        expect(buildItemPath('projects', 'apple')).toBe('/projects/apple')
    })

    it('handles research section', () => {
        expect(buildItemPath('research', 'order-book')).toBe('/research/order-book')
    })
})

describe('resolveNavPath', () => {
    it('maps root to /', () => {
        expect(resolveNavPath('/')).toBe('/')
    })

    it('maps /work to /work', () => {
        expect(resolveNavPath('/work')).toBe('/work')
    })

    it('maps /projects/* to /work', () => {
        expect(resolveNavPath('/projects/apple')).toBe('/work')
        expect(resolveNavPath('/projects/photoshelter')).toBe('/work')
    })

    it('maps /practice and legacy /research/* to /practice', () => {
        expect(resolveNavPath('/practice')).toBe('/practice')
        expect(resolveNavPath('/research')).toBe('/practice')
        expect(resolveNavPath('/research/order-book')).toBe('/practice')
    })

    it('maps /about to /about', () => {
        expect(resolveNavPath('/about')).toBe('/about')
    })

    it('returns the path as-is for unknown routes', () => {
        expect(resolveNavPath('/privacy')).toBe('/privacy')
        expect(resolveNavPath('/resume')).toBe('/resume')
        expect(resolveNavPath('/resume/')).toBe('/resume')
    })
})

describe('NAV_ITEMS', () => {
    it('contains home, work, and about only (practice and résumé are reachable from page content, not the top nav)', () => {
        const labels = NAV_ITEMS.map(item => item.label)
        expect(labels).toEqual(['home', 'work', 'about'])
    })

    it('has valid href values', () => {
        for (const item of NAV_ITEMS) {
            expect(item.href).toMatch(/^\//)
        }
    })
})
