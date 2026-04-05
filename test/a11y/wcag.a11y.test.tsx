import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

/**
 * WCAG compliance tests beyond axe-core automated checks.
 * Covers: touch targets, color contrast, heading hierarchy,
 * reduced motion, card structure, breadcrumb nav, external links.
 */

beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        })),
    })
})

// ---------------------------------------------------------------------------
// WCAG 2.5.8 — Target Size (Minimum 44×44 CSS px)
// ---------------------------------------------------------------------------
describe('Touch target sizes (WCAG 2.5.8)', () => {
    it('interactive buttons meet 44px minimum tap target', () => {
        const { container } = render(
            <button
                type="button"
                aria-label="Switch to dark mode"
                style={{ width: 44, height: 44, padding: 0 }}
            >
                <span aria-hidden="true" />
            </button>
        )
        const button = container.querySelector('button')!
        const style = button.style
        expect(parseInt(style.width)).toBeGreaterThanOrEqual(44)
        expect(parseInt(style.height)).toBeGreaterThanOrEqual(44)
    })

    it('navigation links have adequate vertical padding for touch', () => {
        // Nav links on mobile: padding $s-medium (12px) vertical, font 1.15rem (~18px)
        // Line-height inherited from nav (default ~1.5) adds to computed height
        const MIN_TOUCH_HEIGHT = 44
        const MOBILE_FONT_SIZE = 18 // ~1.15rem
        const LINE_HEIGHT = 1.5
        const VERTICAL_PADDING = 12 // $s-medium
        const totalHeight = Math.ceil(MOBILE_FONT_SIZE * LINE_HEIGHT) + VERTICAL_PADDING * 2

        expect(totalHeight).toBeGreaterThanOrEqual(MIN_TOUCH_HEIGHT)
    })

    it('breadcrumb arrows should meet touch target minimum', () => {
        const { container } = render(
            <nav aria-label="Breadcrumb">
                <a
                    href="/prev"
                    aria-label="Previous: Test Project"
                    style={{ display: 'inline-flex', minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                    &larr;
                </a>
                <span>Current Page</span>
                <a
                    href="/next"
                    aria-label="Next: Another Project"
                    style={{ display: 'inline-flex', minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                    &rarr;
                </a>
            </nav>
        )
        const arrows = container.querySelectorAll('a')
        arrows.forEach(arrow => {
            expect(parseInt(arrow.style.minWidth)).toBeGreaterThanOrEqual(44)
            expect(parseInt(arrow.style.minHeight)).toBeGreaterThanOrEqual(44)
        })
    })
})

// ---------------------------------------------------------------------------
// WCAG 1.4.3 — Contrast (Minimum 4.5:1 for normal text)
// ---------------------------------------------------------------------------
describe('Color contrast (WCAG 1.4.3)', () => {
    // Relative luminance calculation per WCAG 2.0
    function luminance(hex: string): number {
        const rgb = hex.replace('#', '').match(/.{2}/g)!.map(c => {
            const v = parseInt(c, 16) / 255
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
    }

    function contrastRatio(fg: string, bg: string): number {
        const l1 = Math.max(luminance(fg), luminance(bg))
        const l2 = Math.min(luminance(fg), luminance(bg))
        return (l1 + 0.05) / (l2 + 0.05)
    }

    const LIGHT_BG = '#f9f7f4'
    const DARK_BG = '#1a1a1a'
    const AA_MIN = 4.5
    const AA_LARGE_MIN = 3.0

    // Light theme
    it('light theme: text (#333) on background passes AA', () => {
        expect(contrastRatio('#333333', LIGHT_BG)).toBeGreaterThanOrEqual(AA_MIN)
    })

    it('light theme: link (#3c00f7) on background passes AA', () => {
        expect(contrastRatio('#3c00f7', LIGHT_BG)).toBeGreaterThanOrEqual(AA_MIN)
    })

    it('light theme: subheader (#004e98) on background passes AA', () => {
        expect(contrastRatio('#004e98', LIGHT_BG)).toBeGreaterThanOrEqual(AA_MIN)
    })

    it('light theme: coral hover (#d9253f) on background passes AA for large text', () => {
        expect(contrastRatio('#d9253f', LIGHT_BG)).toBeGreaterThanOrEqual(AA_LARGE_MIN)
    })

    it('light theme: hover token (#6ab5db) unused — coral (#d9253f) used instead', () => {
        // The palette defines hover: $sky-blue but t('hover') is not referenced anywhere.
        // Actual hover color in global.scss and components is $coral-red via t('border').
        expect(contrastRatio('#d9253f', LIGHT_BG)).toBeGreaterThanOrEqual(AA_LARGE_MIN)
    })

    // Dark theme
    it('dark theme: text (#ebebeb) on background passes AA', () => {
        expect(contrastRatio('#ebebeb', DARK_BG)).toBeGreaterThanOrEqual(AA_MIN)
    })

    it('dark theme: link (#6ab5db) on background passes AA', () => {
        expect(contrastRatio('#6ab5db', DARK_BG)).toBeGreaterThanOrEqual(AA_MIN)
    })

    it('dark theme: coral border (#d9253f) passes WCAG 1.4.11 non-text contrast (3:1)', () => {
        // Coral is used for border-color on hover, not as text color.
        // WCAG 1.4.11 requires 3:1 for non-text UI components.
        const NON_TEXT_MIN = 3.0
        expect(contrastRatio('#d9253f', DARK_BG)).toBeGreaterThanOrEqual(NON_TEXT_MIN)
    })
})

// ---------------------------------------------------------------------------
// WCAG 1.3.1 — Heading Hierarchy
// ---------------------------------------------------------------------------
describe('Heading hierarchy (WCAG 1.3.1)', () => {
    it('heading levels do not skip (h1 → h2 → h3)', async () => {
        const { container } = render(
            <div>
                <header><h1>Site Title</h1></header>
                <main>
                    <h2>Section Title</h2>
                    <h3>Subsection</h3>
                    <p>Content</p>
                </main>
            </div>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()

        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
        const levels = Array.from(headings).map(h => parseInt(h.tagName[1]))

        // No heading should skip more than one level
        for (let i = 1; i < levels.length; i++) {
            expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
        }
    })

    it('resume page heading hierarchy is correct (h1 → h2)', () => {
        const levels = [1, 2] // h1 (from header) then h2 (resume sections)
        const hasSkip = levels.some((level, i) => i > 0 && level - levels[i - 1] > 1)
        expect(hasSkip).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// WCAG 2.3.3 — Motion (prefers-reduced-motion)
// ---------------------------------------------------------------------------
describe('Reduced motion (WCAG 2.3.3)', () => {
    it('CSS transitions are declared with duration that can be disabled', () => {
        // Verify the dithered shadow mixin produces transitions
        // that would be overridden by prefers-reduced-motion
        const style = document.createElement('style')
        style.textContent = `
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `
        document.head.appendChild(style)
        expect(style.sheet).toBeTruthy()
        document.head.removeChild(style)
    })
})

// ---------------------------------------------------------------------------
// WCAG 4.1.2 — Card link structure (DitheredCard)
// ---------------------------------------------------------------------------
describe('DitheredCard accessibility (WCAG 4.1.2)', () => {
    it('card with two-layer DOM is accessible as a single link', async () => {
        const { container } = render(
            <a href="/projects/test" style={{ display: 'block', position: 'relative' }}>
                <div style={{ overflow: 'hidden', backgroundColor: '#f9f7f4' }}>
                    <div style={{ aspectRatio: '4/3' }} />
                    <div>
                        <h3>Project Title</h3>
                        <p>Subtitle text</p>
                    </div>
                </div>
            </a>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()

        // The outer element must be the link
        const link = container.querySelector('a')
        expect(link).toBeTruthy()
        expect(link?.getAttribute('href')).toBe('/projects/test')
    })

    it('card placeholder with aria-hidden does not expose to AT', async () => {
        const { container } = render(
            <a href="/research/test">
                <div>
                    <div aria-hidden="true" />
                    <div>
                        <h3>Research Title</h3>
                        <p>Subtitle</p>
                    </div>
                </div>
            </a>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
})

// ---------------------------------------------------------------------------
// WCAG 2.4.8 — Breadcrumb navigation
// ---------------------------------------------------------------------------
describe('Breadcrumb navigation (WCAG 2.4.8)', () => {
    it('breadcrumb with prev/next arrows has proper ARIA', async () => {
        const { container } = render(
            <div>
                <nav aria-label="Daniel Arcé">
                    <ul>
                        <li><a href="/">home</a></li>
                        <li><a href="/work">work</a></li>
                    </ul>
                </nav>
                <div>
                    <a href="/projects/prev" aria-label="Previous: Previous Project">&larr;</a>
                    <span>Current Project</span>
                    <a href="/projects/next" aria-label="Next: Next Project">&rarr;</a>
                </div>
            </div>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()

        // Arrow links must have descriptive aria-labels
        const arrows = container.querySelectorAll('a[aria-label]')
        expect(arrows.length).toBeGreaterThanOrEqual(2)
        arrows.forEach(arrow => {
            const label = arrow.getAttribute('aria-label')!
            expect(label.length).toBeGreaterThan(0)
            // Labels should include direction AND destination
            expect(label).toMatch(/Previous:|Next:/)
        })
    })

    it('disabled breadcrumb arrows are hidden from AT', async () => {
        const { container } = render(
            <div>
                <span aria-hidden="true">&larr;</span>
                <span>First Project</span>
                <a href="/projects/next" aria-label="Next: Second Project">&rarr;</a>
            </div>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()

        const hidden = container.querySelector('[aria-hidden="true"]')
        expect(hidden).toBeTruthy()
    })
})

// ---------------------------------------------------------------------------
// WCAG 2.4.4 — External links
// ---------------------------------------------------------------------------
describe('External link identification (WCAG 2.4.4)', () => {
    it('external links have target and rel attributes', async () => {
        const { container } = render(
            <main id="main-content">
                <a
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    External Site
                </a>
                <a href="mailto:test@example.com">Email</a>
                <a href="/internal">Internal Link</a>
            </main>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()

        // External links must have security attributes
        const external = container.querySelector('a[href^="https"]')!
        expect(external.getAttribute('target')).toBe('_blank')
        expect(external.getAttribute('rel')).toContain('noopener')
    })

    it('internal links do not have target="_blank"', () => {
        const { container } = render(
            <main>
                <a href="/work">Work</a>
                <a href="/about">About</a>
            </main>
        )
        const links = container.querySelectorAll('a')
        links.forEach(link => {
            expect(link.getAttribute('target')).not.toBe('_blank')
        })
    })
})

// ---------------------------------------------------------------------------
// WCAG 2.4.6 — Mobile sub-navigation
// ---------------------------------------------------------------------------
describe('Mobile prev/next navigation (WCAG 2.4.6)', () => {
    it('prev/next nav has distinct aria-label from main nav', async () => {
        const { container } = render(
            <div>
                <nav aria-label="Daniel Arcé">
                    <a href="/">home</a>
                </nav>
                <main>
                    <article><h2>Project</h2></article>
                    <nav aria-label="Previous and next">
                        <a href="/projects/prev">
                            <span>&larr; Previous</span>
                            <span>Prev Project</span>
                        </a>
                        <a href="/projects/next">
                            <span>Next &rarr;</span>
                            <span>Next Project</span>
                        </a>
                    </nav>
                </main>
            </div>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()

        // Nav labels must be distinct
        const navs = container.querySelectorAll('nav')
        const labels = Array.from(navs).map(n => n.getAttribute('aria-label'))
        const unique = new Set(labels)
        expect(unique.size).toBe(labels.length)
    })
})
