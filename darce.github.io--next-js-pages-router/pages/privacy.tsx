import type { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout/Layout'
import { getMdxIndexContent } from '../lib/getMdxContent'
import { SITE_URL, SITE_NAME } from '../lib/seo'

const PrivacyPage: NextPageWithLayout = () => {
    return (
        <div className="singleColumn">
            <Head>
                <title>Privacy — {SITE_NAME}</title>
                <meta name="description" content="Privacy policy for darce.xyz" />
                <meta property="og:title" content={`Privacy — ${SITE_NAME}`} />
                <meta property="og:url" content={`${SITE_URL}/privacy/`} />
            </Head>

            <h2>Privacy</h2>

            <p>
                This site collects anonymous usage data to understand how visitors use the site.
                No personal information is collected. No cookies are used for tracking.
            </p>

            <h3>What is collected</h3>
            <ul>
                <li>Page views (which pages are visited)</li>
                <li>Engagement time (how long pages are viewed)</li>
                <li>Scroll depth (how far down a page visitors scroll)</li>
                <li>Web performance metrics (page load speed)</li>
                <li>Referrer URL (how visitors arrived at the site)</li>
                <li>UTM campaign parameters (if present in the URL)</li>
            </ul>

            <h3>How it is collected</h3>
            <p>
                This site uses Google Analytics and a self-hosted analytics service
                (AltContext). An anonymous identifier is stored in your browser's
                localStorage to distinguish unique visits. This identifier cannot be
                used to identify you personally.
            </p>

            <h3>What is not collected</h3>
            <ul>
                <li>Names, email addresses, or other personal information</li>
                <li>IP addresses (not stored by the self-hosted analytics)</li>
                <li>Tracking cookies</li>
            </ul>

            <h3>Third parties</h3>
            <p>
                Google Analytics is subject to{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                    Google's Privacy Policy
                </a>.
                The self-hosted analytics service runs on infrastructure controlled by the site owner.
            </p>

            <h3>Your choices</h3>
            <p>
                You can block analytics by using a browser extension such as uBlock Origin,
                or by enabling Do Not Track in your browser settings.
                You can clear the anonymous identifier by clearing your browser's localStorage
                for this domain.
            </p>

            <h3>Contact</h3>
            <p>
                Questions about this policy: <a href="mailto:daniel.arce@gmail.com">daniel.arce@gmail.com</a>
            </p>
        </div>
    )
}

PrivacyPage.getLayout = (page: ReactElement) => {
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

export default PrivacyPage
