import { useState, useEffect } from 'react'

interface ResponsiveViewState {
    isMobile: boolean | null
    isTablet: boolean | null
    isDesktop: boolean | null
}

/**
 * Hook to track responsive view state based on body class changes
 * Classes are set by _app.tsx based on window width
 */
export const useResponsiveView = (): ResponsiveViewState => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null)
    const [isTablet, setIsTablet] = useState<boolean | null>(null)
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

    useEffect(() => {
        const setResponsiveViewStates = () => {
            const isCurrentlyMobile = document.body.classList.contains('mobile-view')
            const isCurrentlyTablet = document.body.classList.contains('tablet-view')
            const isCurrentlyDesktop = !isCurrentlyMobile && !isCurrentlyTablet

            setIsMobile(isCurrentlyMobile)
            setIsTablet(isCurrentlyTablet)
            setIsDesktop(isCurrentlyDesktop)
        }

        setResponsiveViewStates()

        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                setResponsiveViewStates()
            })
        })

        observer.observe(document.body, { attributes: true })
        
        return () => {
            observer.disconnect()
        }
    }, [])

    return { isMobile, isTablet, isDesktop }
}

export default useResponsiveView
