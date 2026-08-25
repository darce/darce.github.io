import Head from 'next/head'
import type { NextPage } from 'next'
import { SITE_NAME } from '../lib/seo'

const RESUME_PDF = '/daniel_arce_resume.pdf'

/**
 * No layout — /resume/ hands the visitor straight to the PDF.
 *
 * Nothing on the site links here; the footer and About point at the PDF so the
 * refresh never enters their history. This route exists for a typed or shared
 * URL, and its visible fallback offers Home as well, because a page whose only
 * control re-opens the file the visitor just backed out of is a trap.
 */
const ResumePage: NextPage = () => (
    <>
        <Head>
            <title>Resume — {SITE_NAME}</title>
            <meta name="robots" content="noindex, nofollow" />
            <meta httpEquiv="refresh" content={`0; url=${RESUME_PDF}`} />
        </Head>
        <p>
            <a href={RESUME_PDF}>Download resume (PDF)</a>
            {' | '}
            <a href="/">Home</a>
        </p>
    </>
)

export default ResumePage
