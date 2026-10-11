import fs from 'node:fs'
import { expect, test } from '@playwright/test'
import tokens from '../../design-tokens/portfolio.tokens.json'
import { articles } from '../support/content'
import { buildItemPath } from '../../lib/routes'
import { expectImagesReady } from '../support/browser'

test('article captions share the masthead treatment without controls', async ({ page }) => {
    await page.goto('/projects/workbay/')
    const reference = await page.getByRole('article').locator('figure > figcaption').first().evaluate(element => {
        const style = getComputedStyle(element)
        return [style.fontFamily, style.fontSize, style.lineHeight, style.fontStyle, style.fontWeight, style.opacity, style.color]
    })
    for (const { section, slug } of articles) {
        await page.goto(buildItemPath(section, slug))
        const article = page.getByRole('article')
        await expect(article).toBeVisible()
        await expect(article.locator('figcaption button, figcaption a')).toHaveCount(0)
        for (const caption of await article.locator('figcaption').all()) {
            expect(await caption.evaluate(element => {
                const style = getComputedStyle(element)
                return [style.fontFamily, style.fontSize, style.lineHeight, style.fontStyle, style.fontWeight, style.opacity, style.color]
            })).toEqual(reference)
        }
    }
})

test('work and research images share continuous inset or wide figure layouts', async ({ page }) => {
    for (const { section, slug, file } of articles) {
        await page.goto(buildItemPath(section, slug))
        await page.evaluate(() => document.fonts.ready)
        const body = page.getByRole('article').locator('[data-article-body]')
        const canvas = (await body.boundingBox())!
        const contentFlow = await body.getAttribute('data-article-layout') === 'flow'
        const rootSize = await page.evaluate(() => Number.parseFloat(getComputedStyle(document.documentElement).fontSize))
        const wraps = page.viewportSize()!.width > tokens.breakpoint['tablet-end'].$value.value && canvas.width >= tokens.article.inset['minimum-container'].$value.value * rootSize
        for (const image of await body.locator('img').all()) {
            expect(await image.evaluate(element => element.closest('figure')?.getAttribute('data-layout')), `${section}/${slug}: image uses shared figure`).toMatch(/^(inset|wide)$/)
        }
        // A pair owns its children's layout. Only standalone insets float.
        const figures = await body.locator('figure[data-layout="inset"]').all()
        let standaloneIndex = 0
        for (const figure of figures) {
            if (await figure.evaluate(element => Boolean(element.closest('[data-diagram-pair]')))) continue
            if (contentFlow) {
                expect((await figure.boundingBox())!.width).toBeLessThanOrEqual(canvas.width)
            } else {
                expect((await figure.boundingBox())!.width / canvas.width).toBeCloseTo(wraps ? tokens.article.inset['width-share'].$value : 1, 1)
            }
            const side = contentFlow ? (await figure.getAttribute('data-side') === 'left' ? 'left' : 'right') : (standaloneIndex % 2 === 0 ? 'right' : 'left')
            standaloneIndex++
            await expect(figure).toHaveCSS('float', wraps ? side : 'none')
            await expect(figure.locator('figcaption')).toContainText(/\S/)
        }
        const expectedPairs = [...fs.readFileSync(file, 'utf8').matchAll(/<DiagramPair>([\s\S]*?)<\/DiagramPair>/g)]
            .map(match => [...match[1].matchAll(/\balt="([^"]*)"/g)].map(image => image[1]))
        const pairs = body.locator('[data-diagram-pair]')
        await expect(pairs).toHaveCount(expectedPairs.length)
        for (const [index, pair] of (await pairs.all()).entries()) {
            await expect(pair).toHaveCSS('display', 'flex')
            await expect(pair).toHaveCSS('flex-wrap', 'wrap')
            const children = pair.locator(':scope > figure')
            expect(await children.locator('img').evaluateAll(images => images.map(image => image.getAttribute('alt'))), 'pair keeps authored source order').toEqual(expectedPairs[index])
            for (const child of await children.all()) {
                await expect(child).toHaveCSS('float', 'none')
                await expect(child.locator('figcaption')).toContainText(/\S/)
            }
            await expectImagesReady(children.locator('img'))
            // Sample after every lazy image is decoded, in one viewport frame.
            // Scrolling a child between parent/child reads makes parentY stale.
            const { pairBox, samples, columnGap, rowGap } = await pair.evaluate(element => ({
                pairBox: element.getBoundingClientRect().toJSON(),
                columnGap: Number.parseFloat(getComputedStyle(element).columnGap),
                rowGap: Number.parseFloat(getComputedStyle(element).rowGap),
                samples: [...element.querySelectorAll(':scope > figure')].map(child => {
                    const image = child.querySelector('img')!
                    return {
                        box: child.getBoundingClientRect().toJSON(),
                        imageBox: image.getBoundingClientRect().toJSON(),
                        native: { width: image.naturalWidth, height: image.naturalHeight },
                    }
                }),
            }))
            for (const { box, imageBox, native } of samples) {
                expect(imageBox.width, 'diagram labels retain their intrinsic reading size').toBeCloseTo(native.width, 0)
                expect(imageBox.width / imageBox.height).toBeCloseTo(native.width / native.height, 2)
                expect(box.width).toBeCloseTo(Math.min(native.width, pairBox.width), 0)
                expect(box.x).toBeGreaterThanOrEqual(pairBox.x - 1)
                expect(box.x + box.width).toBeLessThanOrEqual(pairBox.x + pairBox.width + 1)
                expect(box.y).toBeGreaterThanOrEqual(pairBox.y - 1)
                expect(box.y + box.height).toBeLessThanOrEqual(pairBox.y + pairBox.height + 1)
            }
            const boxes = samples.map(sample => sample.box)
            const nativeWidths = samples.map(sample => sample.native.width)
            expect(boxes).toHaveLength(2)
            if (nativeWidths[0] + nativeWidths[1] + columnGap <= pairBox.width + 1) {
                expect(boxes[1].y, 'figures share a row when their intrinsic sizes fit').toBeCloseTo(boxes[0].y, 0)
                expect(boxes[1].x).toBeGreaterThanOrEqual(boxes[0].x + boxes[0].width + columnGap - 1)
            } else {
                expect(boxes[1].y, 'figures wrap in source order when their intrinsic sizes do not fit').toBeGreaterThanOrEqual(boxes[0].y + boxes[0].height + rowGap - 1)
            }
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${section}/${slug}: no page overflow`).toBeLessThanOrEqual(1)
    }
})

test('PhotoShelter keeps narrative continuity around alternating evidence', async ({ page }) => {
    await page.goto('/projects/photoshelter/')
    await page.evaluate(() => document.fonts.ready)
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
        // A second paragraph must continue beside the first GIF, rather than
        // waiting for an image-and-paragraph row to finish.
        const firstGif = (await figures.nth(1).boundingBox())!
        const nextParagraph = article.locator('p').filter({ hasText: /^I built a custom keyboard layer/ })
        const firstLine = await nextParagraph.evaluate(element => {
            const range = document.createRange()
            range.selectNodeContents(element)
            const line = range.getClientRects()[0]
            return { x: line.x, y: line.y }
        })
        expect(firstLine.y).toBeGreaterThan(firstGif.y)
        expect(firstLine.y).toBeLessThan(firstGif.y + firstGif.height)
        expect(firstLine.x).toBeGreaterThan(firstGif.x + firstGif.width)

        const lastImage = (await figures.last().locator('img').boundingBox())!
        const nextSection = (await article.getByRole('heading', { name: 'Carrying the patterns into later changes' }).boundingBox())!
        expect(nextSection.y).toBeLessThan(lastImage.y + lastImage.height)
    }
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
        const hasWrappingImage = await body.locator('figure[data-layout="inset"]').evaluateAll(elements => elements.some(element => getComputedStyle(element).float !== 'none'))
        const type = await paragraphs.evaluateAll(elements => elements.map(element => {
            const font = getComputedStyle(element)
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            ctx.font = `${font.fontSize} ${font.fontFamily}`
            return { width: element.getBoundingClientRect().width, character: ctx.measureText('0').width, leading: Number.parseFloat(font.lineHeight) / Number.parseFloat(font.fontSize) }
        }))
        for (const paragraph of type) {
            if (!hasWrappingImage) expect(paragraph.width / paragraph.character).toBeLessThanOrEqual(75)
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

test('full-size evidence opens a fitted modal with an icon close control and keyboard dismissal', async ({ page }) => {
    await page.goto('/projects/photoshelter/')
    const originalURL = page.url()
    const originalPages = page.context().pages().length
    const originalOverflow = await page.evaluate(() => document.body.style.overflow)
    const opener = page.getByRole('button', { name: 'Expand image: Keyboard navigation for the main menu', exact: true })
    for (const theme of ['light', 'dark']) {
        if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark mode' }).click()
        await opener.scrollIntoViewIfNeeded()
        const inlineImage = page.getByRole('article').locator('img[alt="Keyboard navigation for the main menu"]')
        await expect.poll(() => inlineImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
        const inlineWidth = (await inlineImage.boundingBox())!.width
        await opener.focus()
        await page.keyboard.press('Enter')
        const dialog = page.getByRole('dialog', { name: 'Keyboard navigation for the main menu', exact: true })
        await expect(dialog).toBeVisible()
        await expect(dialog).toHaveCSS('font-family', await page.getByRole('article').evaluate(element => getComputedStyle(element).fontFamily))
        await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused()
        await expect(dialog.getByRole('button')).toHaveCount(1)
        const close = dialog.getByRole('button', { name: 'Close', exact: true })
        await expect(close.locator('svg[aria-hidden="true"]')).toHaveCount(1)
        await expect(close).toHaveText('')
        expect(page.url()).toBe(originalURL)
        expect(page.context().pages()).toHaveLength(originalPages)
        expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')
        for (const key of ['Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab']) {
            await page.keyboard.press(key)
            expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
        }
        await opener.evaluate(element => element.focus())
        expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
        const image = dialog.getByRole('img', { name: 'Keyboard navigation for the main menu', exact: true })
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
        // Measure painted pixels, not the larger object-fit element box.
        const paintedWidth = () => image.evaluate((element: HTMLImageElement) => Math.min(element.clientWidth, element.clientHeight * element.naturalWidth / element.naturalHeight))
        const fittedWidth = await paintedWidth()
        if (page.viewportSize()!.width > 1024) expect(fittedWidth).toBeGreaterThan(inlineWidth)
        const viewport = dialog.getByRole('region', { name: 'Image', exact: true })
        expect(await viewport.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
        expect(await viewport.evaluate(element => element.scrollHeight - element.clientHeight)).toBeLessThanOrEqual(1)
        // Touching an inspected image must not trigger sibling-page navigation.
        await viewport.evaluate(element => {
            const touch = (x: number) => new Touch({ identifier: 1, target: element, clientX: x, clientY: 200 })
            element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch(250)], changedTouches: [touch(250)] }))
            element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [touch(100)] }))
        })
        expect(page.url()).toBe(originalURL)
        await expect(dialog).toBeVisible()
        expect(await paintedWidth()).toBeCloseTo(fittedWidth, 0)
        await page.keyboard.press('Escape')
        await expect(dialog).toHaveCount(0)
        await expect(opener).toBeFocused()
        expect(await page.evaluate(() => document.body.style.overflow)).toBe(originalOverflow)
        await opener.focus()
        await page.keyboard.press('Space')
        await dialog.getByRole('button', { name: 'Close', exact: true }).click()
        await expect(dialog).toHaveCount(0)
        await expect(opener).toBeFocused()
    }

    await page.addStyleTag({ content: 'html { font-size: 200%; }' })
    const secondOpener = page.getByRole('button', { name: 'Expand image: The main menu goes from mouse to keyboard control', exact: true })
    await secondOpener.click()
    const secondDialog = page.getByRole('dialog', { name: 'The main menu goes from mouse to keyboard control', exact: true })
    await expect(secondDialog).toBeVisible()
    expect(await secondDialog.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    const closeButton = secondDialog.getByRole('button', { name: 'Close', exact: true })
    const closeBox = (await closeButton.boundingBox())!
    expect(closeBox.x).toBeGreaterThanOrEqual(0)
    expect(closeBox.x + closeBox.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    await closeButton.click()
    await expect(secondDialog).toHaveCount(0)
    await expect(secondOpener).toBeFocused()
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
