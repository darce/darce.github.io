import type { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import { MarkdownData } from '../types'
import { getMdxContent, getMdxIndexContent } from '../lib/getMdxContent'
import { MDXRemote } from 'next-mdx-remote'
import Layout from '../components/layout/Layout'
import DitheredCard from '../components/common/DitheredCard/DitheredCard'
import styles from '../styles/practicePage.module.scss'
import { SITE_URL, SITE_NAME } from '../lib/seo'

interface PracticePageProps {
    practiceData: MarkdownData[]
}

const PracticePage: NextPageWithLayout<PracticePageProps> = ({ practiceData }) => {
    const practiceContent = practiceData[0]

    const practicePageDescription = 'How Daniel Arcé makes design and engineering judgment inspectable — the Heuristics Canon, cited by rule ID against real product decisions.'

    return (
        <div className={`practicePage ${styles.practice}`}>
            <Head>
                <title>Practice — {SITE_NAME}</title>
                <meta name="description" content={practicePageDescription} />
                <meta property="og:title" content={`Practice — ${SITE_NAME}`} />
                <meta property="og:description" content={practicePageDescription} />
                <meta property="og:url" content={`${SITE_URL}/practice/`} />
            </Head>
            <article className={styles.source}>
                <MDXRemote {...practiceContent.mdxSource} />
            </article>
            <DitheredCard href="/research/" className={styles.researchLink}>
                <span className={styles.researchLinkLabel}>See the research index &rarr;</span>
            </DitheredCard>
            <div className={styles.cta}>
                <a href="mailto:daniel.arce@gmail.com">Get in touch</a>
                {' · '}
                <a href="/work/">View work</a>
            </div>
        </div>
    )
}

PracticePage.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build */
export const getStaticProps = async () => {
    const practiceProps = await getMdxContent({ subDir: 'practice' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })

    return {
        props: {
            practiceData: practiceProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default PracticePage
