import { createRequire } from 'node:module'
import path from 'node:path'
import { expect, type Locator, type Page } from '@playwright/test'
import { NAV_ITEMS } from '../../lib/routes'
import type { AxeResults } from 'axe-core'

// Independent WCAG requirements are the oracle, not values read from the site's CSS.
export const wcag = { minimumTarget: 24, textContrast: 4.5 }

export async function auditBrowser(page: Page) {
    await waitForTheme(page, await requestedAppearance(page))
    await page.addScriptTag({ path: createRequire(path.join(process.cwd(), 'package.json')).resolve('axe-core/axe.min.js') })
    const results: AxeResults = await page.evaluate(async () => {
        const axe = (window as unknown as { axe: typeof import('axe-core') }).axe
        return axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } })
    })
    expect(results.violations, JSON.stringify(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary })) })), null, 2)).toEqual([])
}

export async function cssColor(page: Page, value: string) {
    return page.evaluate(color => {
        const sample = document.createElement('span')
        sample.style.color = color
        document.body.append(sample)
        const result = getComputedStyle(sample).color
        sample.remove()
        return result
    }, value)
}

export const paintedBackground = (locator: Locator) => locator.evaluate(element => {
    for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
        const color = getComputedStyle(ancestor).backgroundColor
        if (color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') return color
    }
    throw new Error('No painted background found')
})

export function contrastRatio(foreground: string, background: string) {
    const luminance = (color: string) => {
        const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number)
        if (!channels || channels.length !== 3) throw new Error(`Unsupported computed color: ${color}`)
        const linear = channels.map(channel => {
            const value = channel / 255
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
        })
        return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
    }
    const [high, low] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
    return (high + 0.05) / (low + 0.05)
}

export const primaryNavigation = (page: Page) => page.getByRole('navigation').filter({ has: page.getByRole('link', { name: NAV_ITEMS[0].label, exact: true }) })
export const themeButton = (page: Page) => primaryNavigation(page).getByRole('button')

async function requestedAppearance(page: Page): Promise<'light' | 'dark'> {
    return (await themeButton(page).getAttribute('aria-label')) === 'Switch to light mode' ? 'dark' : 'light'
}

async function waitForTheme(page: Page, appearance: 'light' | 'dark') {
    await expect(page.locator('body')).toHaveAttribute('data-theme', appearance)
    await expect(page.locator('.radix-themes[data-is-root-theme]')).toHaveClass(new RegExp(`\\b${appearance}\\b`))
    await expect(page.locator(appearance === 'dark' ? '.theme--dark' : '.theme--default')).toHaveAttribute('data-theme', appearance)
    await page.evaluate(async () => {
        // Ignore unrelated motion, but do not sample a color transition as a
        // settled palette. A cancelled transition has completed as well.
        await Promise.all(document.getAnimations().filter(animation =>
            animation instanceof CSSTransition && /color|background/.test(animation.transitionProperty)
        ).map(animation => animation.finished.catch(() => {})))
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    })
}

type ThemeFrame = { body: string | null; custom: string; radix: string; pairs: Array<{ text: string; foreground: string; background: string; minimum: number }> }
type ThemeAuditWindow = Window & { themeAudit?: { running: boolean; frames: ThemeFrame[] } }

export async function changeTheme(page: Page) {
    // A previous click can leave the pointer over the intentionally animated
    // swatch. Move away before asking Playwright to wait for a stable target.
    await page.mouse.move(0, 0)
    const previous = await requestedAppearance(page)
    await waitForTheme(page, previous)
    // Start before the click: auditing only after waiting would hide a real
    // low-contrast frame during the switch.
    await page.evaluate(() => {
        const state = { running: true, frames: [] as ThemeFrame[] }
        ;(window as ThemeAuditWindow).themeAudit = state
        const sample = () => {
            const pairs: ThemeFrame['pairs'] = []
            const nav = document.querySelector('#primary-navigation')!
            const walker = document.createTreeWalker(nav, NodeFilter.SHOW_TEXT)
            for (let node = walker.nextNode(); node; node = walker.nextNode()) {
                const element = node.parentElement!
                if (!node.textContent?.trim() || element.closest('[aria-hidden="true"]')) continue
                const range = document.createRange()
                range.selectNodeContents(node)
                if (![...range.getClientRects()].some(rect => rect.width > 0 && rect.height > 0)) continue
                let background = ''
                for (let parent: Element | null = element; parent; parent = parent.parentElement) {
                    const color = getComputedStyle(parent).backgroundColor
                    if (color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') { background = color; break }
                }
                pairs.push({ text: node.textContent.trim(), foreground: getComputedStyle(element).color, background, minimum: 4.5 })
            }
            const control = nav.querySelector('button')!
            pairs.push({ text: 'theme control stroke', foreground: getComputedStyle(control).borderTopColor, background: getComputedStyle(nav).backgroundColor, minimum: 3 })
            const radix = document.querySelector('.radix-themes[data-is-root-theme]')!
            state.frames.push({
                body: document.body.getAttribute('data-theme'),
                custom: document.querySelector('.theme--dark') ? 'dark' : 'light',
                radix: radix.classList.contains('dark') ? 'dark' : 'light',
                pairs,
            })
            if (state.running) requestAnimationFrame(sample)
        }
        sample()
    })
    await themeButton(page).click()
    const next = previous === 'light' ? 'dark' : 'light'
    await waitForTheme(page, next)
    const frames = await page.evaluate(() => {
        const state = (window as ThemeAuditWindow).themeAudit!
        state.running = false
        return state.frames
    })
    expect(new Set(frames.map(frame => frame.custom))).toEqual(new Set([previous, next]))
    for (const frame of frames) {
        expect(frame.body, 'body and custom theme agree in each painted frame').toBe(frame.custom)
        expect(frame.radix, 'Radix and custom theme agree in each painted frame').toBe(frame.custom)
        expect(frame.pairs.length).toBeGreaterThan(0)
        for (const pair of frame.pairs) {
            expect(contrastRatio(pair.foreground, pair.background), JSON.stringify({ theme: frame.custom, ...pair })).toBeGreaterThanOrEqual(pair.minimum)
        }
    }
}

export async function expectCodeContrast(code: Locator) {
    const pairs = await code.evaluateAll(elements => {
        const found = new Map<string, { token: string; foreground: string; background: string; count: number }>()
        for (const code of elements) {
            const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT)
            for (let node = walker.nextNode(); node; node = walker.nextNode()) {
                if (!node.textContent?.trim()) continue
                const element = node.parentElement!
                const foreground = getComputedStyle(element).color
                let background = ''
                for (let parent: Element | null = element; parent; parent = parent.parentElement) {
                    const color = getComputedStyle(parent).backgroundColor
                    if (color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') { background = color; break }
                }
                const token = element.className || 'plain text'
                const key = JSON.stringify([token, foreground, background])
                const pair = found.get(key) ?? { token, foreground, background, count: 0 }
                pair.count++
                found.set(key, pair)
            }
        }
        return [...found.values()]
    })
    if (await code.count()) expect(pairs.length).toBeGreaterThan(0)
    for (const pair of pairs) expect(contrastRatio(pair.foreground, pair.background), JSON.stringify(pair)).toBeGreaterThanOrEqual(wcag.textContrast)
}

export async function expectMinimumHitTarget(locator: Locator) {
    await locator.page().mouse.move(0, 0)
    await locator.scrollIntoViewIfNeeded()
    const hit = await locator.evaluate((element, minimum) => {
        const box = element.getBoundingClientRect()
        if (box.width >= minimum && box.height >= minimum) return true
        const center = { x: box.left + box.width / 2, y: box.top + box.height / 2 }
        // Hit testing includes a pseudo-element's expanded area, unlike boundingBox().
        const radius = minimum / 2 - 0.5
        return [-radius, radius].every(dx => [-radius, radius].every(dy => {
            const target = document.elementFromPoint(center.x + dx, center.y + dy)
            return target !== null && element.contains(target)
        }))
    }, wcag.minimumTarget)
    expect(hit, `target below WCAG minimum: ${await locator.textContent()}`).toBe(true)
}
