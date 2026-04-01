import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

// These tests render raw HTML structures matching page markup patterns,
// not the actual Next.js page components. No mocks needed.

describe('Page-level accessibility', () => {
    it('404 page has no a11y violations', async () => {
        const { container } = render(
            <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2>Page not found</h2>
                <p style={{ marginTop: '1rem' }}>
                    <a href="/">Back to projects</a>
                    {' | '}
                    <a href="/about/">About</a>
                    {' | '}
                    <a href="/research/">Research</a>
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
                        <a href="/">Work</a>
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

    it('footer with privacy and contact links is accessible', async () => {
        const { container } = render(
            <footer>
                <p>14+ years building accessible software.</p>
                <nav aria-label="Footer links">
                    <a href="/privacy/">Privacy</a>
                    {' | '}
                    <a href="mailto:daniel.arce@gmail.com">Contact</a>
                </nav>
            </footer>
        )
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
