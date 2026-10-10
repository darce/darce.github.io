import fs from 'node:fs'
import matter from 'gray-matter'
import { expect, test } from '@playwright/test'
import { buildItemPath, resolveNavPath } from '../../lib/routes'
import { articles } from '../support/content'
import { breakpoints, palettes, spacing, themes, tokenPixels, typography } from '../support/designTokens'
import { auditBrowser, changeTheme, contrastRatio, cssColor, expectMinimumHitTarget, paintedBackground, primaryNavigation, themeButton, wcag } from '../support/browser'

const projects = articles.filter(article => article.section === 'projects')
const workRoute = resolveNavPath(buildItemPath(projects[0].section, projects[0].slug))
const drawings = articles.filter(article => /<AsciiScreen\b/.test(fs.readFileSync(article.file, 'utf8')))

test('index spacing, navigation targets, themes, and keyboard return paths use the rendered system', async ({ page }) => {
    await page.goto(workRoute)
    const main = page.getByRole('main')
    const intro = main.getByRole('heading', { level: 2 }).first()
    const [introBox, mainBox] = await Promise.all([intro.boundingBox(), main.boundingBox()])
    const token = page.viewportSize()!.width <= tokenPixels(breakpoints.tabletMax) ? spacing['s-large'] : spacing['s-x-large']
    expect(introBox!.x - mainBox!.x).toBe(tokenPixels(token))

    for (const palette of Object.values(themes)) {
        await expect.poll(() => page.getByRole('banner').getByRole('heading', { level: 1 }).evaluate(element => getComputedStyle(element).color)).toBe(await cssColor(page, palette.header))
        await expect.poll(async () => contrastRatio(
            await main.evaluate(element => getComputedStyle(element).color), await paintedBackground(main),
        )).toBeGreaterThanOrEqual(wcag.textContrast)
        const primary = primaryNavigation(page)
        for (const target of await primary.getByRole('link').all()) await expectMinimumHitTarget(target)
        await expectMinimumHitTarget(themeButton(page))
        for (const link of await page.getByRole('contentinfo').getByRole('link').all()) await expectMinimumHitTarget(link)
        await auditBrowser(page)
        await changeTheme(page)
    }

    // The first keyboard action reaches the real skip link and moves focus into main.
    await page.reload()
    await page.keyboard.press('Tab')
    const focusedHref = await page.evaluate(() => document.activeElement?.getAttribute('href'))
    expect(focusedHref).toBe(`#${await main.getAttribute('id')}`)
    await page.keyboard.press('Enter')
    await expect(main).toBeFocused()

    const topic = page.getByRole('navigation').filter({ has: page.locator('a[href^="#"]') }).getByRole('link').first()
    await expectMinimumHitTarget(topic)
    const topicTarget = page.locator((await topic.getAttribute('href'))!)
    await topic.click()
    await expect(topicTarget).toBeFocused()
    const group = page.getByRole('region', { name: (await topicTarget.textContent())!, exact: true })
    const back = group.locator('a[href^="#"]').last()
    await expectMinimumHitTarget(back)
    const backTarget = page.locator((await back.getAttribute('href'))!)
    await back.click()
    await expect(backTarget).toBeFocused()
})

test('a chosen theme paints the page and survives a reload', async ({ page }) => {
    await page.goto('/')
    const main = page.getByRole('main')
    const initial = await paintedBackground(main)
    await changeTheme(page)
    await expect.poll(() => paintedBackground(main)).not.toBe(initial)
    const chosen = await paintedBackground(main)
    await page.reload()
    await expect.poll(() => paintedBackground(main)).toBe(chosen)
})

for (const { file, slug, section } of projects) {
    const { data, content } = matter(fs.readFileSync(file, 'utf8'))
    test(`${slug}: exported article matches current source and remains usable in both themes`, async ({ page }) => {
        await page.goto(buildItemPath(section, slug))
        const article = page.getByRole('article')
        await expect(article.getByRole('heading', { name: data.title, exact: true })).toBeVisible()
        await expect(article).toContainText(data.details)
        const headingText = Array.from(content.matchAll(/^### (.+)$|<h3[^>]*>([^<]+)<\/h3>/gm), match => match[1] ?? match[2])
        for (const name of headingText) await expect(article.getByRole('heading', { name, exact: true })).toBeAttached()
        const sectionHeading = article.getByRole('heading', { level: 3 }).first()
        const type = await sectionHeading.evaluate(element => ({
            size: Number.parseFloat(getComputedStyle(element).fontSize),
            line: Number.parseFloat(getComputedStyle(element).lineHeight),
            root: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
        }))
        expect(type.size).toBeCloseTo(Number.parseFloat(typography['type-h3']) * type.root)
        expect(type.line / type.size).toBeCloseTo(Number.parseFloat(typography['type-lh-h3']))
        for (const image of await article.locator('img').all()) {
            await image.scrollIntoViewIfNeeded()
            await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
        }
        for (const palette of Object.values(themes)) {
            const menu = page.getByRole('navigation', { name: section, exact: true, includeHidden: true })
            if (page.viewportSize()!.width > tokenPixels(breakpoints.tabletMax)) {
                await expect(menu).toBeVisible()
                const current = menu.getByRole('link', { name: data.title, exact: true })
                await expect(current).toHaveAttribute('aria-current', 'page')
                await expect.poll(() => paintedBackground(current)).toBe(await cssColor(page, palette.surface))
            } else {
                await expect(menu).toBeHidden()
            }
            await expect.poll(() => paintedBackground(article)).toBe(await cssColor(page, palette.backgroundColor))
            for (const link of await article.getByRole('link').all()) {
                // Wait for the existing color transition to reach the selected theme.
                await expect(link).toHaveCSS('color', await cssColor(page, palette.link))
                const color = await link.evaluate(element => getComputedStyle(element).color)
                expect(contrastRatio(color, await paintedBackground(link)), (await link.textContent()) ?? '').toBeGreaterThanOrEqual(wcag.textContrast)
                const clipped = await link.evaluate(element => Array.from(element.getClientRects()).some(box => box.left < 0 || box.right > document.documentElement.clientWidth))
                expect(clipped, `link clipped by the viewport: ${await link.textContent()}`).toBe(false)
            }
            await auditBrowser(page)
            await changeTheme(page)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
    })
}

for (const { section, slug } of drawings) {
    test(`${slug}: ASCII drawings retain their accessible alternative and do not wrap`, async ({ page }) => {
        await page.goto(buildItemPath(section, slug))
        const drawings = page.getByRole('article').locator('figure[role="img"]')
        expect(await drawings.count()).toBeGreaterThan(0)
        for (const figure of await drawings.all()) {
            await expect(figure).toHaveAccessibleName(/\S/)
            const pre = figure.locator('pre')
            await expect(pre).toHaveCSS('white-space', 'pre')
            const foreground = await pre.evaluate(element => getComputedStyle(element).color)
            expect(foreground).toBe(await cssColor(page, palettes.ink))
            expect(contrastRatio(foreground, await paintedBackground(pre))).toBeGreaterThanOrEqual(wcag.textContrast)
        }
    })
}
