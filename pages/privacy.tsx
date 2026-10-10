import type { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout/Layout'
import { getMdxContent, getMdxIndexContent } from '../lib/getMdxContent'
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
                This site sends usage events to Google Analytics and AltContext to understand
                which pages visitors use and how those pages perform.
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
                This site uses Google Analytics and AltContext analytics, a service
                operated by the site owner and hosted on Fly.io. It is separate from the
                AltContext image-description product. AltContext analytics stores a randomly
                generated identifier in your
                browser&rsquo;s localStorage and includes it with usage events, so visits
                from that browser can be linked. The analytics code does not ask for your
                name or email address.
            </p>

            <h3>Third parties</h3>
            <p>
                Google Analytics is subject to{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                    Google&rsquo;s Privacy Policy
                </a>.
                {' '}Google Analytics cookies are not disabled by this site.
                The site owner operates the AltContext analytics application on Fly.io. This page
                describes the events sent by the browser; server retention and network logs
                have not been verified for this policy.
            </p>

            <h3>Your choices</h3>
            <p>
                A browser content blocker can prevent analytics requests. This site does
                not check the browser&rsquo;s Do Not Track setting. You can remove the
                AltContext identifier by clearing localStorage for this domain; a new
                identifier is created on a later visit if analytics can run.
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
    const footerProps = await getMdxContent({ subDir: 'footer' })
    return {
        props: {
            headerData: headerProps.parsedMdxArray,
            footerData: footerProps.parsedMdxArray,
        },
    }
}

export default PrivacyPage
