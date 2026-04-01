import type { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout/Layout'
import { getMdxIndexContent } from '../lib/getMdxContent'
import { SITE_NAME } from '../lib/seo'

const NotFoundPage: NextPageWithLayout = () => {
    return (
        <main className="content" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <Head>
                <title>404 — {SITE_NAME}</title>
                <meta name="robots" content="noindex" />
            </Head>
            <h2>Page not found</h2>
            <p style={{ marginTop: '1rem' }}>
                <a href="/" style={{ textDecoration: 'underline' }}>Back to projects</a>
                {' | '}
                <a href="/about/" style={{ textDecoration: 'underline' }}>About</a>
                {' | '}
                <a href="/research/" style={{ textDecoration: 'underline' }}>Research</a>
            </p>
        </main>
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
    return {
        props: {
            headerData: headerProps.parsedMdxArray,
        },
    }
}

export default NotFoundPage
