import { expect, test, type Locator } from '@playwright/test'
import { auditBrowser, changeTheme } from '../support/browser'

const route = '/research/visual-search-workbench-screen-reference/'

async function firstLine(paragraph: Locator) {
    return paragraph.evaluate(element => {
        const node = document.createTreeWalker(element, NodeFilter.SHOW_TEXT).nextNode()!
        const range = document.createRange()
        range.setStart(node, 0)
        range.setEnd(node, Math.min(node.textContent!.length, 20))
        return range.getBoundingClientRect().toJSON()
    })
}

test('screen reference fits evidence to its content and flows copy beside it', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Checks desktop flow at several actual article widths')
    const diagramWidths: number[] = []
    for (const width of [1280, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.goto(route)
        await page.evaluate(() => document.fonts.ready)
        const article = page.getByRole('article')
        const body = article.locator('[data-article-body]')
        const canvas = (await body.boundingBox())!
        const diagrams = body.locator('figure[data-workflow]')
        await expect(diagrams).toHaveCount(3)
        for (const diagram of await diagrams.all()) {
            const box = (await diagram.boundingBox())!
            const contentWidth = await diagram.locator('svg').evaluate(element => element.getBoundingClientRect().width)
            expect(box.width, 'caption does not reserve space beside the graphic').toBeCloseTo(contentWidth, 0)
            expect(box.width).toBeLessThan(canvas.width - 200)
        }
        const diagramBox = (await diagrams.first().boundingBox())!
        diagramWidths.push(diagramBox.width)
        const explanation = article.locator('p').filter({ hasText: /^The search uses an index/ })
        const line = await firstLine(explanation)
        expect(line.y).toBeGreaterThanOrEqual(diagramBox.y)
        expect(line.y).toBeLessThan(diagramBox.y + diagramBox.height)
        expect(line.x + line.width).toBeLessThan(diagramBox.x)
        const proseBox = (await explanation.boundingBox())!
        expect(diagramBox.x - proseBox.x - proseBox.width, 'evidence stays adjacent to the prose on wide canvases').toBeLessThanOrEqual(32)

        const figures = body.locator('figure[data-layout="inset"]')
        await expect(figures).toHaveCount(2)
        for (const figure of await figures.all()) {
            const image = figure.locator('img')
            await image.scrollIntoViewIfNeeded()
            await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
            const figureBox = (await figure.boundingBox())!
            const imageBox = (await image.boundingBox())!
            expect(figureBox.width, 'caption does not reserve an empty image gutter').toBeCloseTo(imageBox.width, 0)
            const ratio = await image.evaluate(element => Number(element.getAttribute('width')) / Number(element.getAttribute('height')))
            expect(imageBox.width / imageBox.height).toBeCloseTo(ratio, 2)
            if (width === 1920) {
                const readingHeight = await image.evaluate(element => Number.parseFloat(getComputedStyle(element).maxBlockSize))
                expect(imageBox.height, 'large screenshots use their reading height instead of the lazy-image fallback width').toBeCloseTo(readingHeight, 0)
            }
        }
        const imageBox = (await figures.first().locator('img').boundingBox())!
        const imageCopy = await firstLine(article.locator('p').filter({ hasText: /^The Similarity view/ }))
        expect(imageCopy.y).toBeGreaterThanOrEqual(imageBox.y)
        expect(imageCopy.y).toBeLessThan(imageBox.y + imageBox.height)
        expect(imageCopy.x).toBeGreaterThan(imageBox.x + imageBox.width)
        for (const heading of await body.locator('h2, h3, h4, h5, h6').all()) {
            await expect(heading).toHaveCSS('border-top-width', '0px')
        }
        for (const paragraph of await body.locator('[data-figure-start] p').all()) {
            const measure = await paragraph.evaluate(element => {
                const font = getComputedStyle(element)
                const context = document.createElement('canvas').getContext('2d')!
                context.font = `${font.fontSize} ${font.fontFamily}`
                const range = document.createRange()
                range.selectNodeContents(element)
                const lines = new Map<number, { left: number; right: number }>()
                for (const rect of range.getClientRects()) {
                    const key = Math.round(rect.top * 100)
                    const line = lines.get(key)
                    lines.set(key, { left: Math.min(line?.left ?? rect.left, rect.left), right: Math.max(line?.right ?? rect.right, rect.right) })
                }
                return Math.max(...[...lines.values()].map(line => line.right - line.left)) / context.measureText('0').width
            })
            expect(measure, 'prose retains a readable measure').toBeLessThanOrEqual(75)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
    }
    expect(Math.max(...diagramWidths) - Math.min(...diagramWidths), 'graphic width follows its own reading size, not a canvas fraction').toBeLessThanOrEqual(1)
})

test('query explanation and storyboard share a row above a full-width screenshot', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'The explanation and diagram share a row at desktop widths')
    for (const width of [1280, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.goto(route)
        await page.evaluate(() => document.fonts.ready)
        const body = page.getByRole('article').locator('[data-article-body]')
        const section = body.locator('section').filter({ has: page.getByRole('heading', { name: '2. Make a result the next query', exact: true }) })
        const image = section.locator('figure img')
        await image.scrollIntoViewIfNeeded()
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
        const diagram = (await section.locator('figure[data-workflow="similar"]').boundingBox())!
        const copy = await firstLine(section.locator('p').first())
        const lastParagraph = (await section.locator('p').last().boundingBox())!
        expect(copy.y).toBeGreaterThanOrEqual(diagram.y)
        expect(copy.y).toBeLessThan(diagram.y + diagram.height)
        expect(copy.x + copy.width).toBeLessThan(diagram.x)
        const screenshot = (await image.boundingBox())!
        const canvas = (await body.boundingBox())!
        expect(screenshot.y).toBeGreaterThanOrEqual(Math.max(diagram.y + diagram.height, lastParagraph.y + lastParagraph.height))
        expect(screenshot.x).toBeCloseTo(canvas.x, 0)
        expect(screenshot.width).toBeCloseTo(canvas.width, 0)
        const ratio = await image.evaluate((element: HTMLImageElement) => element.naturalWidth / element.naturalHeight)
        expect(screenshot.width / screenshot.height).toBeCloseTo(ratio, 2)
    }
})

test('screen reference stacks at narrow widths and enlarged text while retaining readable diagrams', async ({ page }) => {
    for (const [width, enlarged] of [[320, false], [768, false], [1024, false], [1440, true], [1920, true]] as const) {
        await page.setViewportSize({ width, height: 1000 })
        await page.goto(route)
        if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; } article * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } article p { margin-bottom: 2em !important; }' })
        const body = page.getByRole('article').locator('[data-article-body]')
        for (const figure of await body.locator('figure').all()) {
            await expect(figure).toHaveCSS('float', 'none')
            const box = (await figure.boundingBox())!
            expect(box.x).toBeGreaterThanOrEqual(0)
            expect(box.x + box.width).toBeLessThanOrEqual(width)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
    }
})

test('screen reference retains labelled schematics and image inspection in both themes', async ({ page }) => {
    await page.goto(route)
    for (const theme of ['light', 'dark']) {
        if (theme === 'dark') await changeTheme(page)
        await auditBrowser(page)
        const body = page.getByRole('article').locator('[data-article-body]')
        const diagrams = body.locator('figure[role="img"]')
        for (const diagram of await diagrams.all()) {
            await expect(diagram).toHaveAttribute('aria-label', /\S/)
            await expect(diagram.locator('svg[aria-hidden="true"]')).toHaveCount(1)
        }
        const opener = body.locator('figure[data-layout="inset"] button').first()
        await opener.focus()
        await page.keyboard.press('Enter')
        await expect(page.getByRole('dialog')).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(page.getByRole('dialog')).toHaveCount(0)
        await expect(opener).toBeFocused()
    }
})
