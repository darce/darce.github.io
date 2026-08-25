import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import Layout from '../../components/layout/Layout'
import { HeaderDataProvider } from '../../contexts/HeaderContext'
import { FooterDataProvider } from '../../contexts/FooterContext'
import { getMdxContent, getMdxIndexContent } from '../../lib/getMdxContent'
import type { ContentIndexData, MarkdownData } from '../../types'

vi.mock('next/router', () => ({
    useRouter: () => ({ asPath: '/', push: vi.fn(), prefetch: vi.fn(), events: { on: vi.fn(), off: vi.fn() } }),
}))

// The landmark structure is only worth asserting against the components that
// actually ship it. A hand-written fixture drifts silently: it kept asserting a
// footer landmark for as long as the real Layout emitted none.
describe('ARIA landmarks and semantic structure', () => {
    let headerData: ContentIndexData[]
    let footerData: MarkdownData[]

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
    })

    const renderLayout = () =>
        render(
            <HeaderDataProvider initialData={headerData}>
                <FooterDataProvider initialData={footerData}>
                    <Layout>
                        <h2>Projects</h2>
                        <p>Content here.</p>
                    </Layout>
                </FooterDataProvider>
            </HeaderDataProvider>
        )

    it('the shipped layout has no landmark violations', async () => {
        const { container } = renderLayout()
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('the shipped layout emits every landmark the skip link assumes', () => {
        const { container } = renderLayout()

        expect(container.querySelector('header')).toBeTruthy()
        expect(container.querySelector('main')).toBeTruthy()
        expect(container.querySelector('nav')).toBeTruthy()
        expect(container.querySelector('footer')).toBeTruthy()

        const skipLink = container.querySelector('.skip-link')
        expect(skipLink?.getAttribute('href')).toBe('#main-content')
        expect(container.querySelector('#main-content')).toBeTruthy()
    })

    it('the shipped primary nav is named and marks the current page', () => {
        const { container } = renderLayout()

        const nav = container.querySelector('nav')
        expect(nav?.getAttribute('aria-label')).toBeTruthy()

        // asPath is mocked to '/', so home is the one item carrying aria-current
        const current = container.querySelectorAll('[aria-current="page"]')
        expect(current).toHaveLength(1)
        expect(current[0].textContent).toBe('home')
    })

    it('images in content have alt text', async () => {
        const { container } = render(
            <figure>
                <img src="/images/test.png" alt="Descriptive alt text" width={800} height={600} />
                <figcaption>Descriptive alt text</figcaption>
            </figure>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('images without alt text fail axe', async () => {
        const { container } = render(
            <img src="/images/test.png" />
        )
        const results = await axe(container)
        expect(results.violations.length).toBeGreaterThan(0)
        expect(results.violations[0].id).toBe('image-alt')
    })

    it('buttons have accessible names', async () => {
        const { container } = render(
            <div>
                <button aria-label="Switch to dark mode" type="button">
                    <span aria-hidden="true">&#x263E;</span>
                </button>
            </div>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('color contrast is maintained in text elements', async () => {
        const { container } = render(
            <main style={{ backgroundColor: '#e7eaef' }}>
                <h2 style={{ color: '#171920' }}>Heading text</h2>
                <p style={{ color: '#171920' }}>Body text with sufficient contrast.</p>
                <a href="/" style={{ color: '#004e98' }}>Link text</a>
            </main>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
})
