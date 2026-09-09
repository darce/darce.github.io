import type { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout/Layout'
import { getMdxContent, getMdxIndexContent } from '../lib/getMdxContent'
import { SITE_NAME } from '../lib/seo'

const NotFoundPage: NextPageWithLayout = () => {
    return (
        <div className="singleColumn" style={{ textAlign: 'center' }}>
            <Head>
                <title>404 — {SITE_NAME}</title>
                <meta name="robots" content="noindex" />
            </Head>
            <h2>Page not found</h2>
            <p>
                <Link href="/">Home</Link>
                {' | '}
                <Link href="/work/">Work</Link>
                {' | '}
                <Link href="/research/">Research</Link>
                {' | '}
                <Link href="/about/">About</Link>
            </p>
        </div>
    )
}

NotFoundPage.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export const getStaticProps = async () => {
    const headerProps = await getMdxIndexContent({ subDir: 'header' })
    const footerProps = await getMdxContent({ subDir: 'footer' })
    return {
        props: {
            headerData: headerProps.parsedMdxArray,
            footerData: footerProps.parsedMdxArray,
        },
    }
}

export default NotFoundPage
