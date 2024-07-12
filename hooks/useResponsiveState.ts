import { useState, useEffect } from 'react'

const useResponsiveState = () => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null)
    const [isTablet, setIsTablet] = useState<boolean | null>(null)
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

    useEffect(() => {
        /** Observe changes in the body element */
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
            mutations.forEach(mutation => {
                setResponsiveViewStates()
            })
        })

        observer.observe(document.body, { attributes: true })

        return () => {
            observer.disconnect()
        }
    }, [])

    return {
        isMobile,
        isTablet,
        isDesktop
    }
}

export default useResponsiveState