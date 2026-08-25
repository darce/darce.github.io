import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import Layout from '../../components/layout/Layout'
import Footer from '../../components/layout/Footer/Footer'
import NotFoundPage from '../../pages/404'
import PrivacyPage from '../../pages/privacy'
import AboutPage from '../../pages/about'
import { HeaderDataProvider } from '../../contexts/HeaderContext'
import { FooterDataProvider } from '../../contexts/FooterContext'
import { getMdxContent, getMdxIndexContent } from '../../lib/getMdxContent'
import type { ContentIndexData, MarkdownData } from '../../types'

vi.mock('next/router', () => ({
    useRouter: () => ({ asPath: '/', push: vi.fn(), prefetch: vi.fn(), events: { on: vi.fn(), off: vi.fn() } }),
}))

// Every test here mounts shipped components over real content — the same
// pieces the exported pages are built from — so an a11y regression in the
// component fails the assertion. (Project MDX is covered by
// project-mdx.a11y.test.tsx, which renders ProjectDetails over the real
// serialized case study.)

describe('Page-level accessibility', () => {
    let headerData: ContentIndexData[] = []
    let footerData: MarkdownData[] = []
    let aboutData: MarkdownData[] = []

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
        aboutData = (await getMdxContent({ subDir: 'about' })).parsedMdxArray
    })

    const mountInShell = (page: React.ReactElement) =>
        render(
            <HeaderDataProvider initialData={headerData}>
                <FooterDataProvider initialData={footerData}>
                    <Layout>{page}</Layout>
                </FooterDataProvider>
            </HeaderDataProvider>
        ).container

    it('the shipped 404 page inside the shipped layout has no a11y violations', async () => {
        const container = mountInShell(<NotFoundPage />)
        expect(container.querySelector('h2')?.textContent).toBe('Page not found')
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('the shipped layout carries a skip link that targets the main landmark', () => {
        const container = mountInShell(<NotFoundPage />)
        const skipLink = container.querySelector('a.skip-link')
        expect(skipLink?.getAttribute('href')).toBe('#main-content')
        expect(container.querySelector('main#main-content')).not.toBeNull()
    })

    it('the shipped privacy page has no a11y violations', async () => {
        const { container } = render(<PrivacyPage />)
        expect(container.querySelector('h2')?.textContent).toBe('Privacy')
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('the shipped about page has no a11y violations', async () => {
        const { container } = render(<AboutPage aboutData={aboutData} />)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('the shipped footer is accessible and carries its utility links', async () => {
        const { container } = render(<Footer footerData={footerData} />)
        const footer = container.querySelector('footer')!
        expect(footer.querySelector('a[href="/privacy/"]')).toBeTruthy()
        expect(footer.querySelector('a[href^="mailto:"]')).toBeTruthy()
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
})
