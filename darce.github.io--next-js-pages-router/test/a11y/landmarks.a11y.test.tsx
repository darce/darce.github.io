import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

describe('ARIA landmarks and semantic structure', () => {
    it('site layout has correct landmark structure', async () => {
        const { container } = render(
            <div>
                <a href="#main-content" className="skip-link">Skip to main content</a>
                <header>
                    <h1>Daniel Arce</h1>
                    <nav aria-label="Site navigation">
                        <a href="/">Work</a>
                        <a href="/research">Research</a>
                        <a href="/about">About</a>
                    </nav>
                </header>
                <main id="main-content">
                    <h2>Projects</h2>
                    <p>Content here.</p>
                </main>
                <footer>
                    <p>Footer content</p>
                </footer>
            </div>
        )

        const results = await axe(container)
        expect(results).toHaveNoViolations()

        // Verify landmark elements are present
        expect(container.querySelector('header')).toBeTruthy()
        expect(container.querySelector('main')).toBeTruthy()
        expect(container.querySelector('nav')).toBeTruthy()
        expect(container.querySelector('footer')).toBeTruthy()

        // Verify skip link target exists
        expect(container.querySelector('#main-content')).toBeTruthy()
    })

    it('navigation has accessible label', async () => {
        const { container } = render(
            <nav aria-label="Site navigation">
                <a href="/">Work</a>
                <a href="/research">Research</a>
                <a href="/about">About</a>
            </nav>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('multiple nav elements have distinct labels', async () => {
        const { container } = render(
            <div>
                <nav aria-label="Site navigation">
                    <a href="/">Work</a>
                </nav>
                <nav aria-label="Project navigation">
                    <a href="/projects/apple">Apple</a>
                </nav>
            </div>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
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
            <main style={{ backgroundColor: '#fafafa' }}>
                <h2 style={{ color: '#333' }}>Heading text</h2>
                <p style={{ color: '#333' }}>Body text with sufficient contrast.</p>
                <a href="/" style={{ color: '#004e98' }}>Link text</a>
            </main>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
})
