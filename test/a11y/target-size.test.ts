import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const TARGET_SIZE = 24
const PX_PER_REM = 16

const read = (relativePath: string) => readFileSync(join(process.cwd(), relativePath), 'utf8')

const spacingSource = read('styles/spacing.scss')
const typographySource = read('styles/typography.scss')
const navSource = read('components/composite/Nav/Nav.module.scss')
const themeToggleSource = read('components/common/ThemeToggle/ThemeToggle.module.scss')
const sectionViewSource = read('components/features/SectionView/SectionView.module.scss')
const footerSource = read('components/layout/Footer/Footer.module.scss')
const portfolioGroupsSource = read('components/features/PortfolioGroups/PortfolioGroups.module.scss')

const spacingExpressions = Object.fromEntries(
    [...spacingSource.matchAll(/^\$([\w-]+):\s*([^;]+);/gm)].map(([, name, expression]) => [name, expression.trim()]),
)

const spacingTokens: Record<string, number> = {}
const resolveSpacing = (name: string): number => {
    if (spacingTokens[name] !== undefined) return spacingTokens[name]
    const expression = spacingExpressions[name]
    if (!expression) throw new Error(`Missing spacing token $${name}`)

    const pixels = expression
        .replace(/\$([\w-]+)/g, (_, token: string) => String(resolveSpacing(token)))
        .replace(/px/g, '')
        .split('*')
        .map(part => Number(part.trim()))
        .reduce((product, factor) => product * factor, 1)
    spacingTokens[name] = pixels
    return pixels
}

for (const name of Object.keys(spacingExpressions)) resolveSpacing(name)

const extractBlock = (source: string, marker: string, startAt = 0): { body: string; start: number } => {
    const markerStart = source.indexOf(marker, startAt)
    if (markerStart < 0) throw new Error(`Could not find stylesheet block ${marker}`)
    const open = source.indexOf('{', markerStart)
    let depth = 1
    let close = open + 1
    while (depth > 0 && close < source.length) {
        if (source[close] === '{') depth += 1
        if (source[close] === '}') depth -= 1
        close += 1
    }
    if (depth !== 0) throw new Error(`Unclosed stylesheet block ${marker}`)
    return { body: source.slice(open + 1, close - 1), start: markerStart }
}

const directDeclarations = (block: string, property: string): string[] => {
    const values: string[] = []
    let depth = 0
    for (const line of block.split('\n')) {
        if (depth === 0) {
            const declaration = new RegExp(`^\\s*${property}:\\s*([^;]+);`).exec(line)
            if (declaration) values.push(declaration[1].trim())
        }
        depth += (line.match(/{/g) ?? []).length
        depth -= (line.match(/}/g) ?? []).length
    }
    return values
}

const firstDeclaration = (block: string, property: string, occurrence = 0): string => {
    const values = directDeclarations(block, property)
    const value = values[occurrence]
    if (!value) throw new Error(`Missing ${property} declaration`)
    return value
}

const resolveLength = (value: string): number => {
    const trimmed = value.trim()
    if (trimmed === '0') return 0
    const token = /^\$([\w-]+)$/.exec(trimmed)?.[1]
    if (token) return resolveSpacing(token)
    const px = /^(\d*\.?\d+)px$/.exec(trimmed)?.[1]
    if (px) return Number(px)
    const rem = /^(\d*\.?\d+)rem$/.exec(trimmed)?.[1]
    if (rem) return Number(rem) * PX_PER_REM
    throw new Error(`Cannot resolve CSS length ${value}`)
}

const parsePadding = (value: string): [number, number] => {
    const parts = value.split(/\s+/).map(resolveLength)
    if (parts.length === 1) return [parts[0], parts[0]]
    if (parts.length === 2) return [parts[0], parts[0]]
    if (parts.length === 3) return [parts[0], parts[2]]
    if (parts.length === 4) return [parts[0], parts[2]]
    throw new Error(`Cannot resolve padding shorthand ${value}`)
}

const parsePaddingBlock = (value: string): [number, number] => {
    const parts = value.split(/\s+/).map(resolveLength)
    if (parts.length === 1) return [parts[0], parts[0]]
    if (parts.length === 2) return [parts[0], parts[1]]
    throw new Error(`Cannot resolve padding-block ${value}`)
}

const parseLineHeight = (value: string, fontSize: number, inherited: number): number => {
    if (value === 'inherit') return inherited
    if (value.endsWith('%')) return fontSize * Number(value.slice(0, -1)) / 100
    if (/^\d*\.?\d+$/.test(value)) return fontSize * Number(value)
    return resolveLength(value)
}

const blockAfter = (source: string, parentMarker: string, childMarker: string) => {
    const parent = extractBlock(source, parentMarker)
    return extractBlock(source, childMarker, parent.start)
}

const baseLineHeight = resolveLength(firstDeclaration(extractBlock(typographySource, '.base__typography').body, 'line-height'))

describe('measured interactive target sizes (WCAG 2.5.8)', () => {
    it('header navigation links clear 24px on desktop and mobile', () => {
        const nav = extractBlock(navSource, '.nav').body
        const navFontDesktop = resolveLength(firstDeclaration(nav, 'font-size'))
        const navFontMobile = resolveLength(firstDeclaration(extractBlock(nav, '@media(max-width: $tabletMax)').body, 'font-size'))
        const navItems = extractBlock(navSource, '> ul > li').body
        const desktopLineHeight = parseLineHeight(firstDeclaration(navItems, 'line-height'), navFontDesktop, baseLineHeight)
        const mobileLineHeight = parseLineHeight(
            firstDeclaration(extractBlock(navItems, '@media (max-width: $tabletMax)').body, 'line-height'),
            navFontMobile,
            baseLineHeight,
        )
        const navLink = extractBlock(navSource, '        > a {').body
        const desktopPadding = parsePadding(firstDeclaration(navLink, 'padding'))
        const mobilePadding = parsePadding(firstDeclaration(extractBlock(navLink, '@media (max-width: $tabletMax)').body, 'padding'))

        expect(desktopLineHeight + desktopPadding[0] + desktopPadding[1]).toBeGreaterThanOrEqual(TARGET_SIZE)
        expect(mobileLineHeight + mobilePadding[0] + mobilePadding[1]).toBeGreaterThanOrEqual(TARGET_SIZE)
    })

    it('theme toggle exposes a 24px square hit area around its 20px swatch', () => {
        const before = extractBlock(themeToggleSource, '&::before').body
        expect(resolveLength(firstDeclaration(before, 'width'))).toBeGreaterThanOrEqual(TARGET_SIZE)
        expect(resolveLength(firstDeclaration(before, 'height'))).toBeGreaterThanOrEqual(TARGET_SIZE)
    })

    it('breadcrumb prev/next arrows use the large spacing token for both dimensions', () => {
        const arrows = extractBlock(navSource, '.breadcrumbArrow,').body
        const mobile = extractBlock(arrows, '@media (max-width: $tabletMax)').body
        expect(resolveLength(firstDeclaration(mobile, 'min-width'))).toBeGreaterThanOrEqual(TARGET_SIZE)
        expect(resolveLength(firstDeclaration(mobile, 'min-height'))).toBeGreaterThanOrEqual(TARGET_SIZE)
    })

    it('sub-navigation prev/next cards clear 24px from both labels and card borders', () => {
        const navLink = extractBlock(sectionViewSource, '.navLink').body
        const border = resolveLength(firstDeclaration(navLink, 'border').split(/\s+/)[0])
        const label = extractBlock(sectionViewSource, '.navLabel').body
        const title = extractBlock(sectionViewSource, '.navTitle').body
        const labelFont = resolveLength(firstDeclaration(label, 'font-size'))
        const titleFont = resolveLength(firstDeclaration(title, 'font-size'))
        const labelLineHeight = parseLineHeight('inherit', labelFont, baseLineHeight)
        const titleLineHeight = parseLineHeight('inherit', titleFont, baseLineHeight)
        const labelPadding = parsePadding(firstDeclaration(label, 'padding'))
        const titlePadding = parsePadding(firstDeclaration(title, 'padding'))
        const cardHeight = border * 2
            + labelLineHeight + labelPadding[0] + labelPadding[1]
            + titleLineHeight + titlePadding[0] + titlePadding[1]

        expect(cardHeight).toBeGreaterThanOrEqual(TARGET_SIZE)
    })

    it('footer links clear 24px with their inherited line-height and declared padding', () => {
        const footerInner = extractBlock(footerSource, '.footerInner').body
        const footerFont = resolveLength(firstDeclaration(footerInner, 'font-size'))
        const footerLineHeight = parseLineHeight(firstDeclaration(footerInner, 'line-height'), footerFont, baseLineHeight)
        const link = blockAfter(footerSource, '.footerInner', 'a {').body
        const padding = parsePaddingBlock(firstDeclaration(link, 'padding-block'))
        const border = resolveLength(firstDeclaration(link, 'border-bottom').split(/\s+/)[0])
        const linkHeight = footerLineHeight + padding[0] + padding[1] + border

        expect(linkHeight).toBeGreaterThanOrEqual(TARGET_SIZE)
    })

    it('index topic and Back to top links clear 24px from body line-height and spacing padding', () => {
        const topicsLink = blockAfter(portfolioGroupsSource, '.topics', 'a {').body
        const backToTopLink = blockAfter(portfolioGroupsSource, '.backToTop', 'a {').body
        for (const link of [topicsLink, backToTopLink]) {
            const padding = parsePaddingBlock(firstDeclaration(link, 'padding-block'))
            expect(baseLineHeight + padding[0] + padding[1]).toBeGreaterThanOrEqual(TARGET_SIZE)
        }
    })
})
