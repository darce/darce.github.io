import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { MarkdownData } from '../types'

interface UseSectionNavigationOptions {
    section: string
}

interface UseSectionNavigationReturn {
    navigateToItem: (item: MarkdownData) => void
    navigateToSection: (sectionPath: string) => void
    currentSlug: string | undefined
}

/**
 * Hook to handle navigation within content sections
 * Provides consistent navigation patterns for projects, research, etc.
 */
export const useSectionNavigation = ({ section }: UseSectionNavigationOptions): UseSectionNavigationReturn => {
    const router = useRouter()
    
    const currentSlug = router.query.slug as string | undefined

    const navigateToItem = useCallback((item: MarkdownData) => {
        router.push(`/${section}/${item.slug}`)
    }, [router, section])

    const navigateToSection = useCallback((sectionPath: string) => {
        router.push(sectionPath)
    }, [router])

    return {
        navigateToItem,
        navigateToSection,
        currentSlug
    }
}

export default useSectionNavigation
