import { createRequire } from 'node:module'
import path from 'node:path'
import { expect, type Locator, type Page } from '@playwright/test'
import { NAV_ITEMS } from '../../lib/routes'
import type { AxeResults } from 'axe-core'

// Independent WCAG requirements are the oracle, not values read from the site's CSS.
export const wcag = { minimumTarget: 24, textContrast: 4.5 }

export async function auditBrowser(page: Page) {
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

export async function changeTheme(page: Page) {
    // A previous click can leave the pointer over the intentionally animated
    // swatch. Move away before asking Playwright to wait for a stable target.
    await page.mouse.move(0, 0)
    await themeButton(page).click()
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
