import { useEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from "next/head";

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

    /** Style tab focus */
    useEffect(() => {
        const handleKeyDownOnce = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                document.body.classList.add('is-tab')
            }
            window.removeEventListener('keydown', handleKeyDownOnce)
            window.addEventListener('mousedown', handleMouseDownOnce)
        }

        const handleMouseDownOnce = (event: MouseEvent) => {
            document.body.classList.remove('is-tab')
            window.removeEventListener('mousedown', handleMouseDownOnce)
            window.addEventListener('keydown', handleKeyDownOnce)
        }

        window.addEventListener('keydown', handleKeyDownOnce)
        return () => {
            window.removeEventListener('keydown', handleKeyDownOnce)
            window.removeEventListener('mousedown', handleMouseDownOnce)
        }
    }, [])

    const getLayout = Component.getLayout ?? ((page) => page)

    /** Wrap getLayout with HeaderDataProvider */
    return (
        <HeaderDataProvider initialData={pageProps.headerData}>
            <Head>
                <link
                    rel="icon"
                    href="/favicon.ico"
                    sizes="16x16"
                />
                <link
                    rel="icon"
                    href="/favicon-32x32.png"
                    sizes="32x32"
                />
                <link
                    rel="icon"
                    href="/favicon-96x96.png"
                    sizes="96x96"
                />
                <link
                    rel="apple-touch-icon"
                    href="/apple-icon-180x180.png"
                />
            </Head>
            {/* Google tag (gtag.js) */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-MHTZJGSKZL"></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-MHTZJGSKZL');
                        `
                }}
            />
            {getLayout(<Component {...pageProps} />)}
        </HeaderDataProvider>
    )
}

export default PortfolioApp