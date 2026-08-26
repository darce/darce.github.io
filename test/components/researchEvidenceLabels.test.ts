import { describe, expect, it } from 'vitest'
import { formatResearchBadge } from '../../components/features/ProjectDetails/ProjectDetails'

describe('research evidence labels', () => {
    it('explains document type instead of showing a bare taxonomy term', () => {
        expect(formatResearchBadge('type', 'method')).toBe('Format: method')
        expect(formatResearchBadge('type', 'note')).toBe('Format: field note')
        expect(formatResearchBadge('type', 'experiment')).toBe('Format: hypothesis test')
    })

    it('translates lifecycle status into evidence readers can interpret', () => {
        expect(formatResearchBadge('status', 'running')).toBe('Evidence: in daily use')
        expect(formatResearchBadge('status', 'measured')).toBe('Evidence: observational')
        expect(formatResearchBadge('status', 'registered')).toBe('Evidence: measurement pending')
        expect(formatResearchBadge('status', 'rerun')).toBe('Evidence: rerun planned')
        expect(formatResearchBadge('status', 'closed')).toBe('Evidence: closed')
    })
})
