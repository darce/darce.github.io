import { useEffect, useLayoutEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
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
    useLayoutEffect(() => {
        /** Throttled event handler */
        const handleResize = throttle(() => {
            /** Cast css variable */
            const mobileMax: number = styles.mobileMax.replace('px', '') as unknown as number
            document.body.classList.toggle('mobile-view', window.innerWidth <= mobileMax)
        }, 200)

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const getLayout = Component.getLayout ?? ((page) => page)
    return getLayout(<Component {...pageProps} />)
}

export default PortfolioApp