import fs from 'node:fs'
import path from 'node:path'
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test'
import { auditBrowser, changeTheme, expectCodeContrast, expectImagesReady, primaryNavigation, themeButton } from '../support/browser'

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

async function captureArticleEvidence(page: Page, body: Locator, testInfo: TestInfo, slug: string, appearance: 'light' | 'dark') {
    await page.waitForFunction(theme => {
        const radix = document.querySelector('.radix-themes[data-is-root-theme]')
        const custom = document.querySelector(theme === 'dark' ? '.theme--dark' : '.theme--default')
        return document.body.getAttribute('data-theme') === theme && radix?.classList.contains(theme) && custom?.getAttribute('data-theme') === theme
    }, appearance)
    await page.evaluate(async () => {
        await Promise.all(document.getAnimations().filter(animation =>
            animation instanceof CSSTransition && /color|background/.test(animation.transitionProperty)
        ).map(animation => animation.finished.catch(() => {})))
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    })

    await expectImagesReady(body.locator('img'))
    await page.evaluate(() => window.scrollTo(0, 0))

    const profile = testInfo.project.name
    await page.screenshot({ path: testInfo.outputPath(`${slug}-${profile}-${appearance}-flow-full.png`), fullPage: true })

    const firstCode = body.locator('pre').first()
    if (await firstCode.count()) {
        await firstCode.screenshot({ path: testInfo.outputPath(`${slug}-${profile}-${appearance}-code-first-viewport.png`), animations: 'disabled' })
    }
    for (const [index, workflow] of (await body.locator('figure[data-workflow]').all()).entries()) {
        await workflow.screenshot({ path: testInfo.outputPath(`${slug}-${profile}-${appearance}-workflow-${index + 1}.png`), animations: 'disabled' })
    }
    if (slug === 'rotation-matrices') {
        const projection = body.locator('img[src*="rotation-f-projection"]')
        await expect(projection).toHaveCount(1)
        await projection.screenshot({ path: testInfo.outputPath(`${slug}-${profile}-${appearance}-projection.png`), animations: 'disabled' })
    }
    await page.evaluate(() => window.scrollTo(0, 0))
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
            await expectImagesReady(image)
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
        await expectImagesReady(image)
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

test('screen reference retains labelled schematics and image inspection in both themes', async ({ page }, testInfo) => {
    await page.goto(route)
    for (const theme of ['light', 'dark'] as const) {
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
        const dialog = page.getByRole('dialog')
        await dialog.locator('img').evaluate(image => (image as HTMLImageElement).decode())
        await dialog.screenshot({ path: testInfo.outputPath(`visual-search-screen-reference-${testInfo.project.name}-${theme}-viewer.png`), animations: 'disabled' })
        await page.keyboard.press('Escape')
        await expect(page.getByRole('dialog')).toHaveCount(0)
        await expect(opener).toBeFocused()
    }
})

const researchSlugs = [
    'agent-memory', 'visual-search-workbench-process', 'interrogating-agent-memory',
    'economics-of-agent-memory', 'heuristics-canon', 'rotation-matrices', 'order-book',
]

test('theme switching preserves the preference and article across both directions and reload', async ({ page }) => {
    await page.goto('/research/rotation-matrices/')
    const body = page.getByRole('article').locator('[data-article-body]')
    const originalCode = await body.locator('pre').allTextContents()
    for (const appearance of ['dark', 'light', 'dark'] as const) {
        await changeTheme(page)
        expect(await page.evaluate(() => localStorage.getItem('theme-preference'))).toBe(appearance)
        expect(await body.locator('pre').allTextContents()).toEqual(originalCode)
    }
    await page.reload()
    await expect(themeButton(page)).toHaveAttribute('aria-label', 'Switch to light mode')
    await auditBrowser(page)
    await expectCodeContrast(body.locator('pre code'))
    await changeTheme(page)
    expect(await page.evaluate(() => localStorage.getItem('theme-preference'))).toBe('light')
})

for (const slug of researchSlugs) {
    for (const theme of ['light', 'dark'] as const) {
        test(`${slug} retains complete evidence, source order and accessible diagrams in ${theme}`, async ({ page }) => {
            // Avoid depending on a successful external market connection.
            await page.routeWebSocket(/binance/, socket => socket.close())
            await page.goto(`/research/${slug}/`)
            await page.evaluate(() => document.fonts.ready)
            const body = page.getByRole('article').locator('[data-article-body]')
            await expect(body).toHaveAttribute('data-article-layout', 'flow')
            const source = fs.readFileSync(path.join(process.cwd(), 'content/research', slug + '.mdx'), 'utf8')
            const fences = [...source.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(match => match[1])
            const blocks = body.locator('pre')
            await expect(blocks).toHaveCount(fences.length)
            if (theme === 'dark') await changeTheme(page)
            await expectImagesReady(body.locator('img'))
            await auditBrowser(page)
            await expectCodeContrast(blocks.locator('code'))
            for (const [index, block] of (await blocks.all()).entries()) {
                expect(await block.textContent(), 'all code bytes survive highlighting in source order').toBe(fences[index])
                await expect(block).toHaveCSS('white-space', 'pre')
                await expect(block.locator('code')).toHaveCSS('white-space', 'pre')
                await expect(block.locator('code')).toHaveCSS('overflow-x', 'visible')
                await expect(block.locator('code')).toHaveCSS('overflow-y', 'visible')
                await expect(block).toHaveCSS('overflow-x', 'auto')
                const columns = Number(await block.getAttribute('data-code-columns'))
                if (columns >= 68) {
                    await expect(block).toHaveAttribute('data-code-layout', 'wide')
                    await expect(block).toHaveCSS('float', 'none')
                    const box = (await block.boundingBox())!
                    const canvas = (await body.boundingBox())!
                    expect(box.width).toBeCloseTo(canvas.width, 0)
                    if (page.viewportSize()!.width >= 1440) {
                        expect(await block.evaluate(element => element.scrollWidth - element.clientWidth), 'complete long lines fit when the canvas is wide enough').toBeLessThanOrEqual(1)
                    }
                }
            }
            for (const heading of await body.locator('h2').all()) await expect(heading).toHaveCSS('border-top-width', '0px')
            for (const diagram of await body.locator('[data-workflow]').all()) {
                await expect(diagram).toHaveAttribute('aria-label', /\S/)
                await expect(diagram.locator('svg')).toHaveAttribute('aria-hidden', 'true')
                for (const text of await diagram.locator('svg text').all()) {
                    expect(await text.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize) * (element as SVGGraphicsElement).getScreenCTM()!.a)).toBeGreaterThanOrEqual(13)
                }
            }
            for (const figure of await body.locator('figure[data-layout]').all()) {
                const image = figure.locator('img')
                await expect(image).toHaveAttribute('alt', /\S/)
                await expect(figure.locator('figcaption')).toContainText(/\S/)
                const box = (await image.boundingBox())!
                const ratio = await image.evaluate((element: HTMLImageElement) => element.naturalWidth / element.naturalHeight)
                expect(box.width / box.height).toBeCloseTo(ratio, 1)
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
        })
        test(`${slug} captures full article and detail evidence in ${theme}`, async ({ page }, testInfo) => {
            await page.routeWebSocket(/binance/, socket => socket.close())
            await page.goto(`/research/${slug}/`)
            await page.evaluate(() => document.fonts.ready)
            if (theme === 'dark') await changeTheme(page)
            const body = page.getByRole('article').locator('[data-article-body]')
            await captureArticleEvidence(page, body, testInfo, slug, theme)
        })
    }
}

async function keyboardScrollToLineEnd(block: Locator) {
    const page = block.page()
    await block.scrollIntoViewIfNeeded()
    const maximum = await block.evaluate(element => element.scrollWidth - element.clientWidth)
    expect(maximum, 'this check must exercise an actual overflowing code region').toBeGreaterThan(1)
    // Enter through the document's Tab sequence, including image buttons.
    for (let tabs = 0; tabs < 100 && !await block.evaluate(element => element === document.activeElement); tabs++) {
        await page.keyboard.press('Tab')
    }
    await expect(block).toBeFocused()
    await page.keyboard.press('Home')
    await expect.poll(() => block.evaluate(element => element.scrollLeft)).toBe(0)
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => block.evaluate(element => element.scrollLeft), 'real ArrowRight scrolls the focused pre').toBeGreaterThan(0)
    await page.keyboard.press('End')
    await expect.poll(() => block.evaluate(element => element.scrollWidth - element.clientWidth - element.scrollLeft), 'End reaches the whole long-line extent').toBeLessThanOrEqual(1)
    const lineEnds = await block.locator('code').evaluate(code => {
        const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT)
        const nodes: Text[] = []
        for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node as Text)
        const text = code.textContent!
        const offsets = [...text.matchAll(/\S(?=\s*(?:\n|$))/g)].map(match => match.index)
        const ends = offsets.map(offset => {
            let remaining = offset
            const node = nodes.find(node => {
                if (remaining < node.length) return true
                remaining -= node.length
                return false
            })!
            const range = document.createRange()
            range.setStart(node, remaining)
            range.setEnd(node, remaining + 1)
            const rect = range.getBoundingClientRect()
            return { left: rect.left, right: rect.right }
        })
        const pre = code.closest('pre')!
        const region = pre.getBoundingClientRect()
        return { ends, viewportLeft: region.left + pre.clientLeft, viewportRight: region.left + pre.clientLeft + pre.clientWidth }
    })
    const rightmost = lineEnds.ends.reduce((a, b) => b.right > a.right ? b : a)
    expect(rightmost.left, 'the terminal character of the longest rendered line is visible at End').toBeGreaterThanOrEqual(lineEnds.viewportLeft - 1)
    expect(rightmost.right).toBeLessThanOrEqual(lineEnds.viewportRight + 1)
    // Home exposes the beginning, not necessarily the end of the final line.
    await page.keyboard.press('Home')
    await expect.poll(() => block.evaluate(element => element.scrollLeft)).toBe(0)
    const sourceGlyph = (edge: 'first' | 'last') => block.locator('code').evaluate((code, edge) => {
        const pre = code.closest('pre')!
        const range = document.createRange()
        const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT)
        let target: Text | null = null
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            if (!node.textContent?.trim()) continue
            target = node as Text
            if (edge === 'first') break
        }
        const text = target!.textContent!
        const offset = edge === 'first' ? text.length - text.trimStart().length : text.trimEnd().length - 1
        range.setStart(target!, offset)
        range.setEnd(target!, offset + 1)
        const rect = range.getBoundingClientRect()
        const region = pre.getBoundingClientRect()
        return { left: rect.left, right: rect.right, viewportLeft: region.left + pre.clientLeft, viewportRight: region.left + pre.clientLeft + pre.clientWidth }
    }, edge)
    const beginning = await sourceGlyph('first')
    expect(beginning.left, 'the beginning-of-code glyph is visible at Home').toBeGreaterThanOrEqual(beginning.viewportLeft - 1)
    expect(beginning.right).toBeLessThanOrEqual(beginning.viewportRight + 1)

    let finalGlyph = await sourceGlyph('last')
    const visible = (glyph: typeof finalGlyph) => glyph.left >= glyph.viewportLeft - 1 && glyph.right <= glyph.viewportRight + 1
    if (!visible(finalGlyph)) {
        await page.keyboard.press('End')
        await expect.poll(() => block.evaluate(element => element.scrollWidth - element.clientWidth - element.scrollLeft)).toBeLessThanOrEqual(1)
        finalGlyph = await sourceGlyph('last')
    }
    // A shorter final line can fall left of the viewport at End. Reach it
    // using real, bounded arrow input, allowing native scrolling to advance.
    for (let arrows = 0; arrows < 100 && !visible(finalGlyph); arrows++) {
        await page.keyboard.press(finalGlyph.left < finalGlyph.viewportLeft - 1 ? 'ArrowLeft' : 'ArrowRight', { delay: 100 })
        finalGlyph = await sourceGlyph('last')
    }
    await expect(block).toBeFocused()
    expect(finalGlyph.left, 'the final source character is reachable by keyboard').toBeGreaterThanOrEqual(finalGlyph.viewportLeft - 1)
    expect(finalGlyph.right).toBeLessThanOrEqual(finalGlyph.viewportRight + 1)
    // Return to the beginning so evidence captures do not retain a clipped line.
    await page.keyboard.press('Home')
    await expect.poll(() => block.evaluate(element => element.scrollLeft)).toBe(0)
}

for (const slug of researchSlugs) {
    for (const [width, enlarged] of [[320, false], [768, false], [320, true], [1440, true]] as const) {
        // research.config runs these explicit viewports once, in desktop.
        test(`${slug} contains code overflow at ${width}px and ${enlarged ? '200%' : '100%'} root-font text resize @viewport-matrix`, async ({ page }) => {
            await page.routeWebSocket(/binance/, socket => socket.close())
            await page.setViewportSize({ width, height: 1000 })
            await page.goto(`/research/${slug}/`)
            if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' })
            await page.evaluate(() => document.fonts.ready)
            const body = page.getByRole('article').locator('[data-article-body]')
            await primaryNavigation(page).focus()
            let overflowing = 0
            let intrinsicOverflowing = 0
            for (const block of await body.locator('pre').all()) {
                await expect(block).toHaveCSS('float', 'none')
                await expect(block.locator('code')).toHaveCSS('overflow-x', 'visible')
                await expect(block.locator('code')).toHaveCSS('overflow-y', 'visible')
                const maximum = await block.evaluate(element => element.scrollWidth - element.clientWidth)
                // Labelled ASCII illustrations have a prose alternative and
                // intentionally omit code tab stops; every code scroller must work.
                const illustration = await block.evaluate(element => Boolean(element.closest('figure[role="img"]')))
                if (maximum > 1 && !illustration) {
                    await expect(block).toHaveAttribute('tabindex', '0')
                    await keyboardScrollToLineEnd(block)
                    overflowing++
                    if (await block.getAttribute('data-code-layout') === 'intrinsic') intrinsicOverflowing++
                }
            }
            if (width === 320 && ['rotation-matrices', 'order-book'].includes(slug)) expect(overflowing, `${slug}: keyboard proof includes an overflowing region, enlarged=${enlarged}`).toBeGreaterThan(0)
            if (width === 320 && slug === 'order-book') expect(intrinsicOverflowing, 'normally short code still scrolls when the viewport is narrow').toBeGreaterThan(0)
            expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${slug}, ${width}px, enlarged=${enlarged}`).toBeLessThanOrEqual(1)
        })
    }
}

test('short market payload takes intrinsic width and leaves usable copy beside it', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop intrinsic width check')
    await page.setViewportSize({ width: 1920, height: 1000 })
    await page.goto('/research/order-book/')
    const body = page.getByRole('article').locator('[data-article-body]')
    const code = body.locator('pre[data-code-layout="intrinsic"]').first()
    await expect(code).toHaveCSS('float', 'right')
    const box = (await code.boundingBox())!
    const canvas = (await body.boundingBox())!
    expect(box.width).toBeLessThan(canvas.width - 250)
    const copy = await firstLine(body.locator('p').filter({ hasText: /^The first bid level/ }))
    expect(copy.y).toBeGreaterThanOrEqual(box.y)
    expect(copy.y).toBeLessThan(box.y + box.height)
    expect(copy.x + copy.width).toBeLessThan(box.x)
})
