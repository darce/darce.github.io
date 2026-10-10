import { describe, expect, it } from 'vitest'
import { render, within } from '@testing-library/react'
import SectionCards from '../../components/features/SectionCards/SectionCards'
import { formatResearchBadge } from '../../lib/researchEvidenceLabels'
import { getMdxIndexContent } from '../../lib/getMdxContent'
import { baseMetaSchema } from '../../lib/schemas'

describe('research evidence labels', () => {
    it('explains every supported vocabulary value rather than exposing bare taxonomy', () => {
        const vocabularies = {
            type: baseMetaSchema.shape.type.unwrap().options,
            status: baseMetaSchema.shape.status.unwrap().options,
        }
        for (const kind of ['type', 'status'] as const) {
            for (const value of vocabularies[kind]) {
                expect(formatResearchBadge(kind, value).trim()).not.toBe(value)
            }
        }
    })
    it('uses the shared formatter on every current research card', async () => {
        const { parsedMdxArray: items } = await getMdxIndexContent({ subDir: 'research' })
        const { container } = render(<SectionCards section="research" items={items} />)
        for (const item of items) {
            const card = within(container).getByRole('link', { name: new RegExp(item.metaData.title!) })
            for (const kind of ['type', 'status'] as const) {
                const value = item.metaData[kind]
                if (value) expect(card).toHaveTextContent(formatResearchBadge(kind, value))
            }
        }
    })
    it('preserves an unknown vocabulary value and still identifies its category', () => {
        const unknown = 'a future evidence term'
        const type = formatResearchBadge('type', unknown)
        const status = formatResearchBadge('status', unknown)
        expect(type).toContain(unknown)
        expect(status).toContain(unknown)
        expect(type).not.toBe(unknown)
        expect(status).not.toBe(unknown)
        expect(type).not.toBe(status)
    })
})
