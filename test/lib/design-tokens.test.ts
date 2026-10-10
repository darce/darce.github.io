import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import tokens from '../../design-tokens/portfolio.tokens.json'

const { renderSassTokens } = createRequire(import.meta.url)('../../scripts/lib/design-tokens.js') as {
    renderSassTokens: (document: unknown) => string
}

describe('DTCG portfolio tokens', () => {
    it('keeps the generated Sass identical to its typed source', () => {
        expect(fs.readFileSync(path.join(process.cwd(), 'styles/generated/_portfolio-tokens.scss'), 'utf8')).toBe(renderSassTokens(tokens))
    })

    it('resolves inherited types and typed aliases without inventing CSS dimension units', () => {
        const output = renderSassTokens({
            spacing: { $type: 'dimension', gutter: { $value: { value: 1.5, unit: 'rem' } } },
            figure: { gutter: { $type: 'dimension', $value: '{spacing.gutter}' }, share: { $type: 'number', $value: 0.5 } },
        })
        expect(output).toContain('$figure-gutter: 1.5rem;')
        expect(output).toContain('$figure-share: 0.5;')
        expect(() => renderSassTokens({ width: { $type: 'dimension', $value: { value: 28, unit: 'vw' } } })).toThrow(/px or rem/)
        expect(() => renderSassTokens({ measure: { $type: 'number', $value: '72ch' } })).toThrow(/finite number/)
    })

    it('rejects broken, cyclic, and incorrectly typed aliases', () => {
        expect(() => renderSassTokens({ a: { $type: 'number', $value: '{missing}' } })).toThrow(/Unknown token/)
        expect(() => renderSassTokens({ a: { $type: 'number', $value: '{b}' }, b: { $type: 'number', $value: '{a}' } })).toThrow(/Circular token/)
        expect(() => renderSassTokens({ a: { $type: 'number', $value: 2 }, b: { $type: 'dimension', $value: '{a}' } })).toThrow(/type mismatch/)
    })
})
