import { expect, test } from '@playwright/test'
import { auditBrowser, changeTheme } from '../support/browser'

test('workflow graphics communicate choices, state changes and linked selections accessibly', async ({ page }) => {
    await page.goto('/research/visual-search-workbench-screen-reference/')
    const body = page.getByRole('article').locator('[data-article-body]')
    const graphics = body.locator('figure[data-workflow]')
    await expect(graphics).toHaveCount(3)
    await expect(body.locator('pre')).toHaveCount(0)
    await expect(graphics.nth(0)).toHaveAccessibleName(/words.*reference image.*candidate photographs/i)
    await expect(graphics.nth(1)).toHaveAccessibleName(/Find similar.*Back to text results/)
    await expect(graphics.nth(2)).toHaveAccessibleName(/A, B, and C.*same photographs/i)

    for (const graphic of await graphics.all()) {
        await expect(graphic.locator('svg')).toHaveAttribute('aria-hidden', 'true')
        await expect(graphic.locator('figcaption')).toContainText('Schematic')
    }
    for (const theme of ['light', 'dark']) {
        if (theme === 'dark') await changeTheme(page)
        await auditBrowser(page)
        for (const graphic of await graphics.all()) {
            const box = (await graphic.boundingBox())!
            for (const label of await graphic.locator('svg text').all()) {
                const bounds = (await label.boundingBox())!
                expect(bounds.x).toBeGreaterThanOrEqual(box.x - 1)
                expect(bounds.x + bounds.width).toBeLessThanOrEqual(box.x + box.width + 1)
                expect(await label.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize) * (element as SVGGraphicsElement).getScreenCTM()!.a), 'labels remain readable at the actual viewport').toBeGreaterThanOrEqual(13)
            }
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
    }
})
