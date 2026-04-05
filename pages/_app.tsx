import { useEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from "next/head";
import Script from 'next/script'
import { useRouter } from 'next/router'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { HeaderDataProvider } from '../contexts/HeaderContext'
import { BreadcrumbProvider } from '../contexts/BreadcrumbContext'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'
import ErrorBoundary from '../components/common/ErrorBoundary'
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SITE_NAME } from '../lib/seo'
import {
    analyticsConfig,
    initAnalytics,
    trackPageView,
    trackWebVital,
} from '../lib/telemetry/analytics'
import { GA_MEASUREMENT_ID } from '../lib/telemetry/ga'
import '../styles/global.scss'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const AppShell = ({ Component, pageProps }: AppPropsWithLayout) => {
    const router = useRouter()
    const { appearance } = useTheme()

    /** Sync body data-theme for SCSS dark styles */
    useEffect(() => {
        document.body.setAttribute('data-theme', appearance)
    }, [appearance])

    /** Style tab focus */
    useEffect(() => {
        const handleKeyDownOnce = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                document.body.classList.add('is-tab')
            }
            window.removeEventListener('keydown', handleKeyDownOnce)
            window.addEventListener('mousedown', handleMouseDownOnce)
        }

        const handleMouseDownOnce = () => {
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

    useEffect(() => {
        trackPageView(router.asPath)

        const handleRouteChangeComplete = () => {
            trackPageView(window.location.pathname)
        }

        const stopAnalytics = initAnalytics()
        router.events.on('routeChangeComplete', handleRouteChangeComplete)

        return () => {
            router.events.off('routeChangeComplete', handleRouteChangeComplete)
            stopAnalytics()
        }
    }, [router.asPath, router.events])

    const getLayout = Component.getLayout ?? ((page) => page)
    const themeClass = appearance === 'dark' ? 'theme--dark' : 'theme--default'

    return (
        <Theme appearance={appearance} accentColor="cyan" grayColor="gray" radius="medium">
            <HeaderDataProvider initialData={pageProps.headerData}>
            <BreadcrumbProvider
                title={pageProps.breadcrumb ?? null}
                prev={pageProps.breadcrumbPrev ?? null}
                next={pageProps.breadcrumbNext ?? null}
            >
                <Head>
                    <meta name="description" content={SITE_DESCRIPTION} />
                    <meta name="author" content={SITE_NAME} />
                    <meta property="og:site_name" content={SITE_NAME} />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={SITE_TITLE} />
                    <meta property="og:description" content={SITE_DESCRIPTION} />
                    <meta property="og:url" content={SITE_URL} />
                    <link rel="canonical" href={`${SITE_URL}${router.asPath}`} />
                    <link
                        rel="preload"
                        href="/fonts/GeistMonoVariableVF.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        href="/fonts/RobotoFlex[GRAD,XOPQ,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC,opsz,slnt,wdth,wght].woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link rel="icon" href="/favicon.ico" sizes="16x16" />
                    <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
                    <link rel="icon" href="/favicon-96x96.png" sizes="96x96" />
                    <link rel="apple-touch-icon" href="/apple-icon-180x180.png" />
                </Head>
                {analyticsConfig.gaEnabled && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                            strategy="afterInteractive"
                        />
                        <Script id="ga4-init" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                window.gtag = gtag;
                                gtag('js', new Date());
                                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
                            `}
                        </Script>
                    </>
                )}
                <ErrorBoundary>
                    <div className={themeClass}>
                        {getLayout(<Component {...pageProps} />)}
                    </div>
                </ErrorBoundary>
            </BreadcrumbProvider>
            </HeaderDataProvider>
        </Theme>
    )
}

const PortfolioApp = (props: AppPropsWithLayout) => (
    <ThemeProvider>
        <AppShell {...props} />
    </ThemeProvider>
)

export default PortfolioApp

export const reportWebVitals = (metric: NextWebVitalsMetric): void => {
    trackWebVital(metric)
}
