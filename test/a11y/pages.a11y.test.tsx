import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import Footer from '../../components/layout/Footer/Footer'
import { getMdxContent } from '../../lib/getMdxContent'
import type { MarkdownData } from '../../types'

// Most tests here render raw HTML structures matching page markup patterns,
// not the actual Next.js page components. The footer case is the exception:
// it mounts the shipped component so the assertion can fail.

describe('Page-level accessibility', () => {
    let footerData: MarkdownData[] = []

    beforeAll(async () => {
        footerData = (await getMdxContent({ subDir: 'footer' })).parsedMdxArray
    })

    it('404 page has no a11y violations', async () => {
        const { container } = render(
            <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2>Page not found</h2>
                <p style={{ marginTop: '1rem' }}>
                    <a href="/">Home</a>
                    {' | '}
                    <a href="/work/">Work</a>
                    {' | '}
                    <a href="/research/">Research</a>
                    {' | '}
                    <a href="/about/">About</a>
                </p>
            </main>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('privacy page structure has no a11y violations', async () => {
        const { container } = render(
            <main>
                <h2>Privacy</h2>
                <p>This site collects anonymous usage data.</p>
                <h3>What is collected</h3>
                <ul>
                    <li>Page views</li>
                    <li>Engagement time</li>
                </ul>
                <h3>What is not collected</h3>
                <ul>
                    <li>Names or email addresses</li>
                </ul>
                <h3>Contact</h3>
                <p><a href="mailto:daniel.arce@gmail.com">daniel.arce@gmail.com</a></p>
            </main>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('skip link pattern is accessible', async () => {
        const { container } = render(
            <div>
                <a href="#main-content" className="skip-link">Skip to main content</a>
                <header>
                    <nav aria-label="Main navigation">
                        <a href="/work">Work</a>
                        <a href="/research">Research</a>
                        <a href="/about">About</a>
                    </nav>
                </header>
                <main id="main-content">
                    <h1>Page content</h1>
                </main>
            </div>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('project detail markup with external link is accessible', async () => {
        const { container } = render(
            <article>
                <h2>Test Project</h2>
                <aside>
                    <a target="_blank" rel="noopener noreferrer" href="https://example.com">
                        Live site
                    </a>
                    <p>Project description</p>
                </aside>
                <figure>
                    <img src="/images/test.png" alt="Test project screenshot" width={600} height={400} />
                    <figcaption>Test project screenshot</figcaption>
                </figure>
            </article>
        )
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

    it('heading hierarchy follows correct order', async () => {
        // Simulates the about page structure
        const { container } = render(
            <main>
                <h2>Hello, I&apos;m Daniel Arc&eacute;.</h2>
                <p>I build accessible software.</p>
                <ul>
                    <li>Led WCAG remediation</li>
                    <li>Front-end architecture</li>
                </ul>
            </main>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('form/interactive elements have labels', async () => {
        // Simulates the order book symbol selector pattern
        const { container } = render(
            <div>
                <label htmlFor="symbol-select">Trading pair</label>
                <select id="symbol-select" aria-label="Select trading pair">
                    <option value="BTCUSDT">BTC/USDT</option>
                    <option value="ETHUSDT">ETH/USDT</option>
                </select>
                <button type="button" aria-label="Refresh data">Refresh</button>
            </div>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
})
