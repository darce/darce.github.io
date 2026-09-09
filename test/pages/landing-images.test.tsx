import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import Landing, { cardIconFor, FEATURED_SLUGS } from '../../pages/index'
import { getMdxIndexContent } from '../../lib/getMdxContent'
import type { ContentIndexData } from '../../types'
import styles from '../../styles/landingPage.module.scss'

vi.mock('next/router', () => ({
    useRouter: () => ({ asPath: '/', push: vi.fn(), prefetch: vi.fn(), events: { on: vi.fn(), off: vi.fn() } }),
}))

describe('landing page featured images', () => {
    it('serves featured icons from generated variants', async () => {
        const projects = (await getMdxIndexContent({ subDir: 'projects' })).parsedMdxArray
        const featuredProjects = FEATURED_SLUGS
            .map((slug) => projects.find((project) => project.slug === slug))
            .filter((project): project is ContentIndexData => project !== undefined)

        const { container } = render(<Landing featuredProjects={featuredProjects} />)
        const icons = Array.from(container.querySelectorAll(`.${styles.projectIcon} img`))
        const projectsWithIcons = featuredProjects.filter((project) => cardIconFor(project))

        expect(featuredProjects).toHaveLength(FEATURED_SLUGS.length)
        expect(icons).toHaveLength(projectsWithIcons.length)

        for (const icon of icons) {
            const src = icon.getAttribute('src') ?? ''
            const isGifFallback = /\.gif$/i.test(src)

            expect(src.startsWith('/images/_gen/') || isGifFallback).toBe(true)
            if (!isGifFallback) {
                expect(icon.getAttribute('srcset')).toBeTruthy()
            } else {
                // ResponsiveImage intentionally leaves GIFs as plain <img> fallbacks.
                expect(icon.getAttribute('srcset')).toBeNull()
            }
        }
    })
})
