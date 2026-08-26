import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { formatResearchBadge } from '../../lib/researchEvidenceLabels'
import SectionCards from '../../components/features/SectionCards/SectionCards'
import type { ContentIndexData } from '../../types'

vi.mock('next/image', () => ({
    default: (props: { alt: string }) => React.createElement('img', props),
}))

vi.mock('next/link', () => ({
    default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) =>
        React.createElement('a', { href, ...rest }, children),
}))

describe('research evidence labels', () => {
    it('explains document type instead of showing a bare taxonomy term', () => {
        expect(formatResearchBadge('type', 'method')).toBe('Format: method')
        expect(formatResearchBadge('type', 'note')).toBe('Format: field note')
        expect(formatResearchBadge('type', 'experiment')).toBe('Format: hypothesis test')
    })

    it('translates lifecycle status into evidence readers can interpret', () => {
        expect(formatResearchBadge('status', 'running')).toBe('Evidence: in daily use')
        expect(formatResearchBadge('status', 'measured')).toBe('Evidence: measurement complete')
        expect(formatResearchBadge('status', 'registered')).toBe('Evidence: measurement pending')
        expect(formatResearchBadge('status', 'rerun')).toBe('Evidence: rerun planned')
        expect(formatResearchBadge('status', 'closed')).toBe('Evidence: closed')
    })

    it('renders translated labels on research cards and raw metadata on work cards', () => {
        const researchItem: ContentIndexData = {
            slug: 'agent-memory',
            metaData: {
                title: 'Agent Memory',
                subtitle: 'Research card',
                type: 'experiment',
                status: 'measured',
            },
        }
        const workItem: ContentIndexData = {
            slug: 'workbay',
            metaData: {
                title: 'Workbay',
                subtitle: 'Project card',
                type: 'experiment',
                status: 'measured',
            },
        }

        const { unmount } = render(
            React.createElement(SectionCards, { section: 'research', items: [researchItem] })
        )
        expect(screen.getByText('Format: hypothesis test')).toBeInTheDocument()
        expect(screen.getByText('Evidence: measurement complete')).toBeInTheDocument()
        expect(screen.queryByText('experiment')).not.toBeInTheDocument()
        expect(screen.queryByText('measured')).not.toBeInTheDocument()
        unmount()

        render(React.createElement(SectionCards, { section: 'projects', items: [workItem] }))
        expect(screen.getByText('experiment')).toBeInTheDocument()
        expect(screen.getByText('measured')).toBeInTheDocument()
        expect(screen.queryByText('Format: hypothesis test')).not.toBeInTheDocument()
        expect(screen.queryByText('Evidence: measurement complete')).not.toBeInTheDocument()
    })
})
