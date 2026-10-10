import path from 'node:path'
import * as sass from 'sass'

type TokenMap = { [key: string]: string | TokenMap }
const values: Record<string, TokenMap> = {}
const unpack = (value: sass.Value): string | TokenMap => {
    if (value instanceof sass.SassMap) {
        return Object.fromEntries(Array.from(value.contents, ([key, entry]) => [key.assertString().text, unpack(entry)]))
    }
    return value.toString()
}

// Ask Sass for its evaluated modules. No copied palette, spacing, or breakpoint values.
sass.compileString(`
    @use "sass:meta";
    @use "spacing";
    @use "palettes";
    @use "breakpoints.module" as breakpoints;
    @use "typography";
    :root {
        --spacing: #{capture("spacing", meta.module-variables("spacing"))};
        --palettes: #{capture("palettes", meta.module-variables("palettes"))};
        --breakpoints: #{capture("breakpoints", meta.module-variables("breakpoints"))};
        --typography: #{capture("typography", meta.module-variables("typography"))};
    }
`, {
    loadPaths: [path.join(process.cwd(), 'styles')],
    functions: {
        'capture($name, $tokens)': ([name, tokens]) => {
            values[name.assertString().text] = unpack(tokens) as TokenMap
            return new sass.SassString('captured')
        },
    },
})

export const spacing = values.spacing as Record<string, string>
export const breakpoints = values.breakpoints as Record<string, string>
export const typography = values.typography as Record<string, string>
export const palettes = values.palettes as Record<string, string>
export const themes = values.palettes.themes as Record<string, Record<string, string>>
export const tokenPixels = (value: string) => {
    if (!value.endsWith('px')) throw new Error(`Expected a pixel token, received ${value}`)
    return Number.parseFloat(value)
}
