import { beforeAll, describe, expect, it } from 'vitest'
import NotFoundPage from '../../pages/404'
import PrivacyPage from '../../pages/privacy'
import AboutPage from '../../pages/about'
import { getMdxContent } from '../../lib/getMdxContent'
import { auditAccessibility, expectHeadingOutline, loadShellData, renderShell } from '../support/shell'

describe('utility pages inside the shipped shell', () => {
    let shell: Awaited<ReturnType<typeof loadShellData>>
    let about: Awaited<ReturnType<typeof getMdxContent>>
    beforeAll(async () => {
        ;[shell, about] = await Promise.all([loadShellData(), getMdxContent({ subDir: 'about' })])
    })
    const pages = [
        { name: '404', render: () => <NotFoundPage /> },
        { name: 'privacy', render: () => <PrivacyPage /> },
        { name: 'about', render: () => <AboutPage aboutData={about.parsedMdxArray} /> },
    ]
    it.each(pages)('$name has a continuous heading outline and no accessibility violations', async page => {
        const { container } = renderShell(page.render(), shell)
        expectHeadingOutline(container)
        expect(await auditAccessibility(container)).toHaveNoViolations()
    })
})
