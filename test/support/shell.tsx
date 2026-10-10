import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { expect } from 'vitest'
import Layout from '../../components/layout/Layout'
import { HeaderDataProvider } from '../../contexts/HeaderContext'
import { FooterDataProvider } from '../../contexts/FooterContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { getMdxContent, getMdxIndexContent } from '../../lib/getMdxContent'
import { router } from './router'

export const loadShellData = async () => {
    const [header, footer] = await Promise.all([
        getMdxIndexContent({ subDir: 'header' }), getMdxContent({ subDir: 'footer' }),
    ])
    return { header: header.parsedMdxArray, footer: footer.parsedMdxArray }
}

export function renderShell(page: React.ReactElement, data: Awaited<ReturnType<typeof loadShellData>>, route = '/') {
    router.asPath = route
    return render(
        <ThemeProvider>
            <HeaderDataProvider initialData={data.header}>
                <FooterDataProvider initialData={data.footer}>
                    <Layout>{page}</Layout>
                </FooterDataProvider>
            </HeaderDataProvider>
        </ThemeProvider>,
    )
}

export function expectHeadingOutline(container: HTMLElement) {
    const headings = Array.from(container.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    const levels = headings.map(heading => Number(heading.tagName.slice(1)))
    expect(levels.filter(level => level === 1), 'one page heading').toHaveLength(1)
    levels.slice(1).forEach((level, index) => {
        expect(level - levels[index], `heading skips a level: ${headings[index + 1].textContent}`).toBeLessThanOrEqual(1)
    })
}

export const auditAccessibility = (container: HTMLElement) => axe(container, {
    // jsdom has no layout/paint engine. The production-browser suite owns contrast checks.
    rules: { 'color-contrast': { enabled: false } },
})
