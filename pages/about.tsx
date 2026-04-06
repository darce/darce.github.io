import type { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import { MarkdownData } from '../types'
import { getMdxContent, getMdxIndexContent } from '../lib/getMdxContent'
import { MDXRemote } from 'next-mdx-remote'
import Layout from '../components/layout/Layout'
import styles from '../styles/aboutPage.module.scss'
import { SITE_URL, SITE_NAME, personJsonLd } from '../lib/seo'

interface AboutPageProps {
    aboutData: MarkdownData[]
}

const AboutPage: NextPageWithLayout<AboutPageProps> = ({ aboutData }) => {
    const aboutContent = aboutData[0]
    const headShotObj = aboutContent.metaData.images ? aboutContent.metaData.images[0] : null

    const aboutPageDescription = 'About Daniel Arcé — product engineer building accessible, high-trust software systems with AI-assisted workflows, React, and TypeScript.'

    return (
        <div className={`aboutPage ${styles.about}`}>
            <Head>
                <title>About — {SITE_NAME}</title>
                <meta name="description" content={aboutPageDescription} />
                <meta property="og:title" content={`About — ${SITE_NAME}`} />
                <meta property="og:description" content={aboutPageDescription} />
                <meta property="og:url" content={`${SITE_URL}/about/`} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
                />
            </Head>
            <aside className={styles.aside}>
                {headShotObj &&
                    (
                        <figure className={styles.headshot}>
                            <picture>
                                <source
                                    media="(max-width: 1024px)"
                                    srcSet="/images/headshot-dithered-atkinson-200.png"
                                    width={200}
                                    height={200}
                                />
                                <img
                                    src={`/images/${headShotObj.src}`}
                                    alt={headShotObj.alt}
                                    width={300}
                                    height={300}
                                />
                            </picture>
                        </figure>)
                }

            </aside>
            <article className={styles.source}>
                <MDXRemote {...aboutContent.mdxSource} />
            </article>
        </div>
    )
}

AboutPage.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build */
export const getStaticProps = async () => {
    const aboutProps = await getMdxContent({ subDir: 'about' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })

    return {
        props: {
            aboutData: aboutProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}
export default AboutPage
