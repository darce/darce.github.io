import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

/**
 * The selected menu item must share a background color with the adjacent
 * article pane so they read as one surface. This test verifies the SCSS
 * source uses the theme background token via the themeComponent mixin.
 */
describe('Menu selected background matches page background', () => {
    const menuScss = fs.readFileSync(
        path.resolve(__dirname, '../../components/composite/Menu/Menu.module.scss'),
        'utf-8'
    )

    it('selected li uses theme surface token', () => {
        const selectedBlock = menuScss.match(/&\.selected\s*\{[\s\S]*?\n        \}/s)
        expect(selectedBlock).not.toBeNull()
        expect(selectedBlock![0]).toContain("t('surface')")
    })

    it('does not use transparent for selected background', () => {
        const selectedBlock = menuScss.match(/&\.selected\s*\{[^}]*\}/s)
        expect(selectedBlock).not.toBeNull()
        expect(selectedBlock![0]).not.toContain('transparent')
    })

    it('does not use a hardcoded color for selected background', () => {
        const selectedBlock = menuScss.match(/&\.selected\s*\{[^}]*\}/s)
        expect(selectedBlock).not.toBeNull()
        // Should not contain hex colors like #fafafa or #1a1a1a
        expect(selectedBlock![0]).not.toMatch(/#[0-9a-fA-F]{6}/)
    })
})
