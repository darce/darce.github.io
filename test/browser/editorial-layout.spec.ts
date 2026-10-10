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

test('shared case studies preserve the full canvas and limit standalone prose', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'desktop') await page.setViewportSize({ width: 1920, height: 1080 })
    for (const route of ['/projects/photoshelter/', '/projects/msnbc/', '/projects/workbay/']) {
        await page.goto(route)
        const articles = page.getByRole('article')
        await expect(articles).toHaveCount(1)
        await page.evaluate(() => document.fonts.ready)
        const body = articles.first().locator('[data-article-body]')
        const available = await articles.first().evaluate(element => {
            const style = getComputedStyle(element)
            return element.getBoundingClientRect().width - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight)
        })
        const canvas = (await body.boundingBox())!
        expect(canvas.width).toBeCloseTo(available, 0)
        const paragraphs = body.locator('[data-figure-start] > p:not(:has(img, picture))')
        expect(await paragraphs.count()).toBeGreaterThan(0)
        const type = await paragraphs.evaluateAll(elements => elements.map(element => {
            const font = getComputedStyle(element)
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            ctx.font = `${font.fontSize} ${font.fontFamily}`
            return { width: element.getBoundingClientRect().width, character: ctx.measureText('0').width, leading: Number.parseFloat(font.lineHeight) / Number.parseFloat(font.fontSize) }
        }))
        for (const paragraph of type) {
            expect(paragraph.width / paragraph.character).toBeLessThanOrEqual(75)
            expect(paragraph.leading).toBeGreaterThanOrEqual(1.4)
        }
        if (route === '/projects/photoshelter/' && testInfo.project.name === 'desktop') {
            const rightFigure = (await body.locator('figure[data-layout="inset"]').first().boundingBox())!
            expect(rightFigure.x + rightFigure.width).toBeCloseTo(canvas.x + canvas.width, 0)
            expect(rightFigure.width / canvas.width).toBeCloseTo(tokens.article.inset['width-share'].$value, 1)
        }
        for (const caption of await articles.first().locator('figcaption').all()) {
            await expect(caption).toHaveCSS('opacity', '1')
        }
    }
})

test('inset figures reflow with narrow screens and reader text settings', async ({ page }) => {
    for (const width of [320, 768, 1024, 1440, 1920]) {
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
