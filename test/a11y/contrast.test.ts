import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

type ThemeName = 'default' | 'dark'
type PaletteKey =
    | 'backgroundColor'
    | 'surface'
    | 'masthead'
    | 'inactiveBg'
    | 'castShadow'
    | 'header'
    | 'text'
    | 'link'
    | 'border'

type ThemePalette = Record<PaletteKey, string>

const paletteSource = readFileSync(join(process.cwd(), 'styles/palettes.scss'), 'utf8')

const parsePalette = (): Record<ThemeName, ThemePalette> => {
    const variables = Object.fromEntries(
        [...paletteSource.matchAll(/^\s*\$([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/gm)]
            .map(([, name, value]) => [name, value.toLowerCase()]),
    ) as Record<string, string>

    const parseTheme = (theme: ThemeName): ThemePalette => {
        const map = paletteSource.match(new RegExp(`\\n\\s*${theme}:\\s*\\(([\\s\\S]*?)\\n\\s*\\),`))?.[1] ?? ''
        const entries = Object.fromEntries(
            [...map.matchAll(/^\s*(\w+):\s*(\$[\w-]+|#[0-9a-fA-F]{6}),/gm)]
                .map(([, key, reference]) => [
                    key,
                    reference.startsWith('$') ? variables[reference.slice(1)] : reference.toLowerCase(),
                ]),
        ) as Partial<ThemePalette>

        const keys: PaletteKey[] = [
            'backgroundColor',
            'surface',
            'masthead',
            'inactiveBg',
            'castShadow',
            'header',
            'text',
            'link',
            'border',
        ]
        for (const key of keys) {
            expect(entries[key], `${theme}.${key} must resolve to a palette hex`).toMatch(/^#[0-9a-f]{6}$/)
        }
        return entries as ThemePalette
    }

    return {
        default: parseTheme('default'),
        dark: parseTheme('dark'),
    }
}

const palettes = parsePalette()

/** WCAG 2.x relative luminance for an sRGB hex colour. */
const relativeLuminance = (hex: string): number => {
    const channels = hex.slice(1).match(/.{2}/g)?.map(channel => parseInt(channel, 16) / 255)
    if (!channels || channels.length !== 3) {
        throw new Error(`Expected a six-digit hex colour, received ${hex}`)
    }
    const [red, green, blue] = channels.map(channel =>
        channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

/** WCAG 2.x contrast ratio, with the lighter luminance first. */
const contrastRatio = (foreground: string, ground: string): number => {
    const foregroundLuminance = relativeLuminance(foreground)
    const groundLuminance = relativeLuminance(ground)
    const lighter = Math.max(foregroundLuminance, groundLuminance)
    const darker = Math.min(foregroundLuminance, groundLuminance)
    return (lighter + 0.05) / (darker + 0.05)
}

type ContrastPair = {
    theme: ThemeName
    foreground: PaletteKey
    ground: PaletteKey
    floor: number
    rule: string
    usage: string
}

/**
 * These are the token pairs emitted by the shipped theme selectors:
 * body/article ink and headings occur on the canvas, cards/nav surfaces,
 * menu/breadcrumb inactive bands, and the masthead; links occur on each band
 * where a component explicitly paints them; and borders/focus rings occur on
 * the canvas, card/nav surfaces, inactive bands, or masthead. The list does
 * not assert token combinations that never share a rendered selector.
 */
const renderedPairs: ContrastPair[] = [
    // Body text and headings (WCAG 1.4.3, normal text floor 4.5:1).
    { theme: 'default', foreground: 'text', ground: 'backgroundColor', floor: 4.5, rule: '1.4.3', usage: 'body/article text on canvas' },
    { theme: 'default', foreground: 'text', ground: 'surface', floor: 4.5, rule: '1.4.3', usage: 'card/nav text on raised surface' },
    { theme: 'default', foreground: 'text', ground: 'masthead', floor: 4.5, rule: '1.4.3', usage: 'masthead subtitle on band' },
    { theme: 'default', foreground: 'text', ground: 'inactiveBg', floor: 4.5, rule: '1.4.3', usage: 'menu text on inactive band' },
    { theme: 'default', foreground: 'header', ground: 'masthead', floor: 4.5, rule: '1.4.3', usage: 'masthead title on band' },
    { theme: 'dark', foreground: 'text', ground: 'backgroundColor', floor: 4.5, rule: '1.4.3', usage: 'body/article text on canvas' },
    { theme: 'dark', foreground: 'text', ground: 'surface', floor: 4.5, rule: '1.4.3', usage: 'card/nav text on raised surface' },
    { theme: 'dark', foreground: 'text', ground: 'masthead', floor: 4.5, rule: '1.4.3', usage: 'masthead subtitle on band' },
    { theme: 'dark', foreground: 'text', ground: 'inactiveBg', floor: 4.5, rule: '1.4.3', usage: 'menu text on inactive band' },
    { theme: 'dark', foreground: 'header', ground: 'masthead', floor: 4.5, rule: '1.4.3', usage: 'masthead title on band' },

    // Explicit link ink (WCAG 1.4.3, links are body-size text here).
    { theme: 'default', foreground: 'link', ground: 'backgroundColor', floor: 4.5, rule: '1.4.3', usage: 'article/index links on canvas' },
    { theme: 'default', foreground: 'link', ground: 'surface', floor: 4.5, rule: '1.4.3', usage: 'status/breadcrumb links on surface' },
    { theme: 'default', foreground: 'link', ground: 'masthead', floor: 4.5, rule: '1.4.3', usage: 'footer links on footer band' },
    { theme: 'default', foreground: 'link', ground: 'inactiveBg', floor: 4.5, rule: '1.4.3', usage: 'breadcrumb links on inactive band' },
    { theme: 'dark', foreground: 'link', ground: 'backgroundColor', floor: 4.5, rule: '1.4.3', usage: 'article/index links on canvas' },
    { theme: 'dark', foreground: 'link', ground: 'surface', floor: 4.5, rule: '1.4.3', usage: 'status/breadcrumb links on surface' },
    { theme: 'dark', foreground: 'link', ground: 'masthead', floor: 4.5, rule: '1.4.3', usage: 'footer links on footer band' },
    { theme: 'dark', foreground: 'link', ground: 'inactiveBg', floor: 4.5, rule: '1.4.3', usage: 'breadcrumb links on inactive band' },

    // Borders, card edges, accent strokes, and focus rings (WCAG 1.4.11).
    { theme: 'default', foreground: 'border', ground: 'backgroundColor', floor: 3, rule: '1.4.11', usage: 'accent edge against canvas' },
    { theme: 'default', foreground: 'border', ground: 'surface', floor: 3, rule: '1.4.11', usage: 'card/nav accent edge against surface' },
    { theme: 'default', foreground: 'border', ground: 'masthead', floor: 3, rule: '1.4.11', usage: 'footer/nav accent stroke on band' },
    { theme: 'default', foreground: 'border', ground: 'inactiveBg', floor: 3, rule: '1.4.11', usage: 'menu/card accent edge on inactive band' },
    { theme: 'default', foreground: 'castShadow', ground: 'backgroundColor', floor: 3, rule: '1.4.11', usage: 'focus ring against canvas' },
    { theme: 'default', foreground: 'castShadow', ground: 'surface', floor: 3, rule: '1.4.11', usage: 'focus ring against surface' },
    { theme: 'default', foreground: 'castShadow', ground: 'inactiveBg', floor: 3, rule: '1.4.11', usage: 'focus ring against inactive band' },
    { theme: 'dark', foreground: 'border', ground: 'backgroundColor', floor: 3, rule: '1.4.11', usage: 'accent edge against canvas' },
    { theme: 'dark', foreground: 'border', ground: 'surface', floor: 3, rule: '1.4.11', usage: 'card/nav accent edge against surface' },
    { theme: 'dark', foreground: 'border', ground: 'masthead', floor: 3, rule: '1.4.11', usage: 'footer/nav accent stroke on band' },
    { theme: 'dark', foreground: 'border', ground: 'inactiveBg', floor: 3, rule: '1.4.11', usage: 'menu/card accent edge on inactive band' },
    { theme: 'dark', foreground: 'castShadow', ground: 'backgroundColor', floor: 3, rule: '1.4.11', usage: 'focus ring against canvas' },
    { theme: 'dark', foreground: 'castShadow', ground: 'surface', floor: 3, rule: '1.4.11', usage: 'focus ring against surface' },
    { theme: 'dark', foreground: 'castShadow', ground: 'inactiveBg', floor: 3, rule: '1.4.11', usage: 'focus ring against inactive band' },
]

describe('measured theme contrast (WCAG 1.4.3 / 1.4.11)', () => {
    it.each(renderedPairs)('$theme $foreground on $ground ($rule) — $usage', pair => {
        const palette = palettes[pair.theme]
        const ratio = contrastRatio(palette[pair.foreground], palette[pair.ground])
        expect(
            ratio,
            `${pair.theme} ${pair.foreground} on ${pair.ground} measures ${ratio.toFixed(2)}:1; expected at least ${pair.floor}:1`,
        ).toBeGreaterThanOrEqual(pair.floor)
    })
})
