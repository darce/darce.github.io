import Head from 'next/head'
import type { NextPage } from 'next'
import { SITE_NAME } from '../lib/seo'

const RESUME_PDF = '/daniel_arce_resume.pdf'

/** No layout — /resume/ hands the visitor straight to the PDF */
const ResumePage: NextPage = () => (
    <>
        <Head>
            <title>Resume — {SITE_NAME}</title>
            <meta name="robots" content="noindex, nofollow" />
            <meta httpEquiv="refresh" content={`0; url=${RESUME_PDF}`} />
        </Head>
        <a href={RESUME_PDF}>Download resume (PDF)</a>
    </>
)

export default ResumePage
