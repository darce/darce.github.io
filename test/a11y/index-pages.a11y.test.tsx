import { beforeAll, describe, expect, it } from 'vitest'
import Landing, { getStaticProps as landingProps } from '../../pages/index'
import Work from '../../pages/work'
import Research from '../../pages/research/index'
import { getMdxIndexContent } from '../../lib/getMdxContent'
import { auditAccessibility, expectHeadingOutline, loadShellData, renderShell } from '../support/shell'

describe('index pages over real content', () => {
    let shell: Awaited<ReturnType<typeof loadShellData>>
    let projects: Awaited<ReturnType<typeof getMdxIndexContent>>
    let research: Awaited<ReturnType<typeof getMdxIndexContent>>
    let landing: Awaited<ReturnType<typeof landingProps>>
    beforeAll(async () => {
        ;[shell, projects, research, landing] = await Promise.all([
            loadShellData(), getMdxIndexContent({ subDir: 'projects' }),
            getMdxIndexContent({ subDir: 'research' }), landingProps(),
        ])
    })
    const pages = [
        { name: 'landing', render: () => <Landing {...landing.props} /> },
        { name: 'work', render: () => <Work projectsData={projects.parsedMdxArray} /> },
        { name: 'research', render: () => <Research researchData={research.parsedMdxArray} /> },
    ]
    it.each(pages)('$name has a continuous outline, distinct navigation names, and no accessibility violations', async page => {
        const { container } = renderShell(page.render(), shell)
        expectHeadingOutline(container)
        const navs = Array.from(container.querySelectorAll('nav'))
        const labels = navs.map(nav => nav.getAttribute('aria-label'))
        expect(labels.every(Boolean)).toBe(true)
        expect(new Set(labels).size).toBe(navs.length)
        expect(await auditAccessibility(container)).toHaveNoViolations()
    })
})
