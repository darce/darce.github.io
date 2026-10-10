import { expect, test } from '@playwright/test'
import tokens from '../../design-tokens/portfolio.tokens.json'

test('PhotoShelter evidence alternates sides and wraps nearby prose when there is room', async ({ page }) => {
    await page.goto('/projects/photoshelter/')
    const article = page.getByRole('article')
    const figures = article.locator('figure[data-layout="inset"]')
    await expect(figures).toHaveCount(3)
    const body = article.locator('[data-article-body]')
    const width = (await body.boundingBox())!.width
    const rootSize = await page.evaluate(() => Number.parseFloat(getComputedStyle(document.documentElement).fontSize))
    const wraps = page.viewportSize()!.width > tokens.breakpoint['tablet-end'].$value.value && width >= tokens.article.inset['minimum-container'].$value.value * rootSize

    for (const [index, figure] of (await figures.all()).entries()) {
        const image = figure.locator('img')
        await image.scrollIntoViewIfNeeded()
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
        await expect(figure.locator('figcaption')).toContainText(/\S/)
        const box = (await figure.boundingBox())!
        expect(box.width / width).toBeCloseTo(wraps ? tokens.article.inset['width-share'].$value : 1, 1)
        await expect(figure).toHaveCSS('float', wraps ? (index % 2 === 0 ? 'right' : 'left') : 'none')
    }

    if (wraps) {
        // Real text-line positions distinguish wrapping from a two-column box.
        for (const figure of (await figures.all()).slice(1)) {
            const geometry = await figure.evaluate(element => {
                const next = element.nextElementSibling!
                const range = document.createRange()
                range.selectNodeContents(next)
                const line = range.getClientRects()[0]
                return {
                    figure: element.getBoundingClientRect().toJSON(),
                    image: element.querySelector('img')!.getBoundingClientRect().toJSON(),
                    line: { x: line.x, y: line.y, right: line.right },
                    side: getComputedStyle(element).float,
                }
            })
            expect(geometry.line.y).toBeLessThan(geometry.image.bottom)
            if (geometry.side === 'left') expect(geometry.line.x).toBeGreaterThan(geometry.figure.right)
            else expect(geometry.line.right).toBeLessThan(geometry.figure.left)
        }
    }

    const finalFigure = (await figures.last().boundingBox())!
    const nextSection = (await article.getByRole('heading', { name: 'Carrying the patterns into later changes' }).boundingBox())!
    expect(nextSection.y).toBeGreaterThanOrEqual(finalFigure.y + finalFigure.height)
})

test('shared case studies cap the reading measure and keep captions legible', async ({ page }) => {
    for (const route of ['/projects/photoshelter/', '/projects/msnbc/', '/projects/workbay/']) {
        await page.goto(route)
        const articles = page.getByRole('article')
        await expect(articles).toHaveCount(1)
        await page.evaluate(() => document.fonts.ready)
        const prose = articles.first().locator('[data-article-body]')
        const type = await prose.evaluate(element => {
            const font = getComputedStyle(element)
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            ctx.font = `${font.fontSize} ${font.fontFamily}`
            return { width: element.getBoundingClientRect().width, character: ctx.measureText('0').width, leading: Number.parseFloat(font.lineHeight) / Number.parseFloat(font.fontSize) }
        })
        expect(type.width / type.character).toBeLessThanOrEqual(75)
        expect(type.leading).toBeGreaterThanOrEqual(1.4)
        for (const caption of await articles.first().locator('figcaption').all()) {
            await expect(caption).toHaveCSS('opacity', '1')
        }
    }
})

test('inset figures reflow with narrow screens and reader text settings', async ({ page }) => {
    for (const width of [320, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.goto('/projects/photoshelter/')
        await page.addStyleTag({ content: 'html { font-size: 200%; } #main-content article * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } #main-content article p { margin-bottom: 2em !important; }' })
        const figures = page.getByRole('article').locator('figure[data-layout="inset"]')
        await expect(figures).toHaveCount(3)
        for (const figure of await figures.all()) await expect(figure).toHaveCSS('float', 'none')
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
        for (const image of await figures.locator('img').all()) {
            const box = (await image.boundingBox())!
            expect(box.x).toBeGreaterThanOrEqual(0)
            expect(box.x + box.width).toBeLessThanOrEqual(width)
        }
    }
})
