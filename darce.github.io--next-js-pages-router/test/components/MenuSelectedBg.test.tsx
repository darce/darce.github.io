import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

/**
 * The selected menu item must share a background color with the adjacent
 * article pane so they read as one surface. This test verifies the SCSS
 * source uses the same theme token for both.
 */
describe('Menu selected background matches page background', () => {
    const menuScss = fs.readFileSync(
        path.resolve(__dirname, '../../components/composite/Menu/Menu.module.scss'),
        'utf-8'
    )

    it('selected li uses backgroundColor theme token', () => {
        // The &.selected block must reference t('backgroundColor')
        // so it matches the body/page background in both light and dark themes
        const selectedBlock = menuScss.match(/&\.selected\s*\{[^}]*\}/s)
        expect(selectedBlock).not.toBeNull()
        expect(selectedBlock![0]).toContain("t('backgroundColor')")
    })

    it('does not use transparent for selected background', () => {
        const selectedBlock = menuScss.match(/&\.selected\s*\{[^}]*\}/s)
        expect(selectedBlock).not.toBeNull()
        expect(selectedBlock![0]).not.toContain('transparent')
    })

    it('selected background uses themeComponent mixin for correct specificity', () => {
        // Without the mixin, the theme-applied inactiveBg on the li wins
        const selectedBlock = menuScss.match(/&\.selected\s*\{[^}]*\}/s)
        expect(selectedBlock).not.toBeNull()
        expect(selectedBlock![0]).toContain('themeComponent')
    })
})
