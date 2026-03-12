import { useEffect, useState } from 'react'

import breakpoints from '../styles/breakpoints.module.scss'

interface ResponsiveViewState {
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
}

const mobileMax = Number.parseInt(breakpoints.mobileMax, 10)
const tabletMax = Number.parseInt(breakpoints.tabletMax, 10)

const SSR_DEFAULT: ResponsiveViewState = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
}

export const useResponsiveView = (): ResponsiveViewState => {
    const [state, setState] = useState<ResponsiveViewState>(SSR_DEFAULT)

    useEffect(() => {
        const mobileQuery = window.matchMedia(`(max-width: ${mobileMax}px)`)
        const tabletQuery = window.matchMedia(`(min-width: ${mobileMax + 1}px) and (max-width: ${tabletMax}px)`)

        const update = () => {
            const isMobile = mobileQuery.matches
            const isTablet = tabletQuery.matches
            setState({
                isMobile,
                isTablet,
                isDesktop: !isMobile && !isTablet,
            })
        }

        update()
        mobileQuery.addEventListener('change', update)
        tabletQuery.addEventListener('change', update)

        return () => {
            mobileQuery.removeEventListener('change', update)
            tabletQuery.removeEventListener('change', update)
        }
    }, [])

    return state
}

export default useResponsiveView
