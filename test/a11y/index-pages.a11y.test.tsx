import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import Layout from '../../components/layout/Layout'
import Landing, { FEATURED_SLUGS } from '../../pages/index'
import Work from '../../pages/work'
import Research from '../../pages/research/index'
import { HeaderDataProvider } from '../../contexts/HeaderContext'
import { FooterDataProvider } from '../../contexts/FooterContext'
import { getMdxContent, getMdxIndexContent } from '../../lib/getMdxContent'
import type { ContentIndexData, MarkdownData } from '../../types'

vi.mock('next/router', () => ({
    useRouter: () => ({ asPath: '/', push: vi.fn(), prefetch: vi.fn(), events: { on: vi.fn(), off: vi.fn() } }),
}))

// The three index pages are mounted inside the shipped Layout over the real
// content directories, so the outline that is checked is the one exported to
// the site: the site name in the header is the only h1, and each page below
// it must step down one level at a time.

describe('Index pages inside the shipped layout', () => {
    let headerData: ContentIndexData[] = []
    let footerData: MarkdownData[] = []
    let projectsData: ContentIndexData[] = []
    let researchData: ContentIndexData[] = []

    beforeAll(async () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            })),
        })
        headerData = (await getMdxIndexContent({ subDir: 'header' })).parsedMdxArray
        footerData = (await getMdxContent({ subDir: 'footer' })).parsedMdxArray
        projectsData = (await getMdxIndexContent({ subDir: 'projects' })).parsedMdxArray
        researchData = (await getMdxIndexContent({ subDir: 'research' })).parsedMdxArray
    })

    const mountInShell = (page: React.ReactElement) =>
        render(
            <HeaderDataProvider initialData={headerData}>
                <FooterDataProvider initialData={footerData}>
                    <Layout>{page}</Layout>
                </FooterDataProvider>
            </HeaderDataProvider>
        ).container

    const headingLevels = (container: HTMLElement) =>
        Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => Number(h.tagName[1]))

    const expectSteppedOutline = (container: HTMLElement) => {
        const levels = headingLevels(container)
        expect(levels.filter(l => l === 1), 'the site name is the only h1').toHaveLength(1)
        levels.forEach((level, i) => {
            if (i === 0) return
            expect(level - levels[i - 1], `heading outline skips a level at index ${i}: ${levels.join(' ')}`).toBeLessThanOrEqual(1)
        })
    }

    const pages: Array<[string, () => React.ReactElement]> = [
        ['landing', () => {
            const featured = FEATURED_SLUGS
                .map(slug => projectsData.find(p => p.slug === slug))
                .filter((p): p is ContentIndexData => p !== undefined)
            return <Landing featuredProjects={featured} />
        }],
        ['work', () => <Work projectsData={projectsData} />],
        ['research', () => <Research researchData={researchData} />],
    ]

    it.each(pages)('%s page keeps one h1 and never skips a heading level', (_name, page) => {
        expectSteppedOutline(mountInShell(page()))
    })

    it.each(pages)('%s page has no axe violations', async (_name, page) => {
        expect(await axe(mountInShell(page()))).toHaveNoViolations()
    })

    it.each([['work', 1], ['research', 2]] as Array<[string, number]>)(
        '%s page jump list is a labelled nav distinct from the site nav',
        (_name, index) => {
            const container = mountInShell(pages[index][1]())
            const navs = Array.from(container.querySelectorAll('nav'))
            const labels = navs.map(n => n.getAttribute('aria-label'))
            expect(new Set(labels).size, `nav landmarks need distinct names: ${labels.join(', ')}`).toBe(navs.length)
        },
    )
})
