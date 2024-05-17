import { useEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { HeaderDataProvider } from '../contexts/HeaderContext'
import { throttle } from '../lib/utils'
import '../styles/global.scss'
import styles from '../styles/breakpoints.module.scss'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const PortfolioApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    useEffect(() => {
        /** Throttled event handler */
        const handleResize = throttle(() => {
            /** Cast css variable */
            const mobileMax: number = parseInt(styles.mobileMax, 10)
            const tabletMax: number = parseInt(styles.tabletMax, 10)
            const isMobile = window.innerWidth <= mobileMax
            const isTablet = window.innerWidth > mobileMax
                && window.innerWidth <= tabletMax
            document.body.classList.toggle('mobile-view', isMobile)
            document.body.classList.toggle('tablet-view', isTablet)

        }, 100)

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const getLayout = Component.getLayout ?? ((page) => page)

    /** Wrap getLayout with HeaderDataProvider */
    return (
        <HeaderDataProvider initialData={pageProps.headerData}>
            {getLayout(<Component {...pageProps} />)}
        </HeaderDataProvider>
    )
}

export default PortfolioApp