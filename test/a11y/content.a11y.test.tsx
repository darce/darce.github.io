import { describe, expect, it } from 'vitest'
import { within } from '@testing-library/react'
import ProjectDetails from '../../components/features/ProjectDetails/ProjectDetails'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import { buildItemPath } from '../../lib/routes'
import { articles, expectPublicAssetExists } from '../support/content'
import { auditAccessibility, expectHeadingOutline, loadShellData, renderShell } from '../support/shell'

describe('every published article through the real MDX and layout pipeline', () => {
    it.each(articles)('$section/$slug renders its metadata, assets, outline, and accessible figures', async ({ file, slug, section }) => {
        const [{ metaData, mdxSource }, shell] = await Promise.all([parseMarkdownFile(file), loadShellData()])
        expect(mdxSource).toBeDefined()
        const { container } = renderShell(<ProjectDetails project={{ slug, metaData, mdxSource: mdxSource! }} />, shell, buildItemPath(section, slug))
        const article = within(container).getByRole('article')
        expect(within(article).getByRole('heading', { name: metaData.title!, level: 2 })).toBeVisible()
        if (metaData.details) expect(article).toHaveTextContent(metaData.details)
        for (const link of metaData.links?.slice(0, 1) ?? []) {
            expect(within(article).getByRole('link', { name: link.label })).toHaveAttribute('href', link.url)
        }
        expectHeadingOutline(container)
        const ids = Array.from(article.querySelectorAll('[id]'), element => element.id)
        expect(new Set(ids).size, 'anchors are unique within the article').toBe(ids.length)
        for (const image of Array.from(article.querySelectorAll('img'))) {
            expect(image).toHaveAttribute('alt')
            const src = image.getAttribute('src')!
            if (src.startsWith('/')) expectPublicAssetExists(src)
        }
        // Only drawings need a text alternative; ordinary fenced code remains code.
        for (const pre of Array.from(article.querySelectorAll('pre'))) {
            if (!/[┌└├─│]{4,}/.test(pre.textContent ?? '')) continue
            const figure = pre.closest('figure')
            expect(figure, 'box drawing has an accessible figure').not.toBeNull()
            expect(figure).toHaveAttribute('role', 'img')
            expect(figure).toHaveAccessibleName()
            expect(pre.closest('[aria-hidden="true"]')).not.toBeNull()
        }
        expect(await auditAccessibility(container)).toHaveNoViolations()
    })
})
