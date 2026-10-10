import { describe, expect, it } from 'vitest'
import { render, within } from '@testing-library/react'
import Landing, { FEATURED_METRICS, FEATURED_SLUGS, getStaticProps } from '../../pages/index'
import manifest from '../../lib/generated/image-manifest.json'
import { buildItemPath } from '../../lib/routes'
import { expectPublicAssetExists } from '../support/content'

describe('featured cards through the actual page data loader', () => {
    it('renders every configured feature in order with a decorative, usable icon and its current blurb', async () => {
        const { props } = await getStaticProps()
        expect(props.featuredProjects.map(project => project.slug)).toEqual(FEATURED_SLUGS)
        const { container } = render(<Landing {...props} />)
        const view = within(container)
        const candidateSources = Object.values(manifest).flatMap(entry => [...entry.fallback.candidates, ...entry.webp, ...entry.avif]).map(candidate => candidate.src)
        for (const project of props.featuredProjects) {
            const href = buildItemPath('projects', project.slug)
            const card = view.getAllByRole('link').find(link => link.getAttribute('href')?.replace(/\/$/, '') === href)!
            expect(card).toHaveAccessibleName()
            expect(card).toHaveTextContent(FEATURED_METRICS[project.slug])
            const media = [project.metaData.thumbnail, project.metaData.masthead, ...(project.metaData.images ?? [])].filter(Boolean)
            const icon = card.querySelector('img')
            if (!media.length) {
                expect(icon).toBeNull()
                continue
            }
            expect(icon).not.toBeNull()
            expect(icon).toHaveAttribute('alt', '')
            expect(icon!.closest('[aria-hidden="true"]')).not.toBeNull()
            const src = icon!.getAttribute('src')!
            expectPublicAssetExists(src)
            if (src.toLowerCase().endsWith('.gif')) {
                expect(icon!.getAttribute('srcset')).toBeNull()
            } else {
                expect(candidateSources).toContain(src)
                expect(icon).toHaveAttribute('srcset')
                for (const candidate of icon!.getAttribute('srcset')!.split(', ')) {
                    const candidateUrl = candidate.split(' ')[0]
                    expect(candidateSources).toContain(candidateUrl)
                    expectPublicAssetExists(candidateUrl)
                }
            }
        }
    })
})
