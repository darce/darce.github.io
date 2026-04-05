import { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import type { NextPageWithLayout } from './_app'
import { getMdxIndexContent } from '../lib/getMdxContent'
import { ContentIndexData } from '../types'
import Layout from '../components/layout/Layout'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, websiteJsonLd } from '../lib/seo'
import styles from '../styles/landingPage.module.scss'

const FEATURED_SLUGS = ['photoshelter', 'apple', 'msnbc']

const FEATURED_METRICS: Record<string, string> = {
    photoshelter: 'Led WCAG remediation protecting $9.2M ARR in institutional contracts',
    apple: '92% open rate on the marketing department\'s first CSS-animated email campaign',
    msnbc: 'Shipped live video platform under a six-month litigation deadline',
}

interface LandingProps {
    featuredProjects: ContentIndexData[]
}

const Landing: NextPageWithLayout<LandingProps> = ({ featuredProjects }) => {
    return (
        <>
            <Head>
                <title>{SITE_TITLE}</title>
                <meta name="description" content={SITE_DESCRIPTION} />
                <meta property="og:title" content={SITE_TITLE} />
                <meta property="og:description" content={SITE_DESCRIPTION} />
                <meta property="og:url" content={SITE_URL} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
            </Head>
            <div className={styles.landing}>
                <section className={styles.hero}>
                    <div className={styles.heroInner}>
                        <figure className={styles.headshot}>
                            <picture>
                                <source
                                    media="(max-width: 768px)"
                                    srcSet="/images/headshot-dithered-atkinson-96.png"
                                    width={96}
                                    height={96}
                                />
                                <img
                                    src="/images/headshot-dithered-atkinson-120.png"
                                    alt="Daniel Arcé, portrait by Liam Maloney"
                                    width={120}
                                    height={120}
                                />
                            </picture>
                        </figure>
                        <div className={styles.heroText}>
                            <p className={styles.positioning}>
                                Product engineer with 14+ years building accessible software
                                for Apple, MSNBC, PhotoShelter, and startups. Currently building
                                AI-assisted accessibility tooling at{' '}
                                <a href="https://altcontext.com" target="_blank" rel="noopener noreferrer">
                                    AltContext.com.
                                </a>
                            </p>
                            <a
                                className={styles.cta}
                                href="mailto:daniel.arce@gmail.com"
                            >
                                <span className={styles.ctaInner}>Get in touch</span>
                            </a>
                        </div>
                    </div>
                </section>

                <section className={styles.featured}>
                    <h2>Selected work</h2>
                    <ul className={styles.projectList}>
                        {featuredProjects.map((project) => (
                            <li key={project.slug} className={styles.projectItem}>
                                <Link href={`/projects/${project.slug}/`} className={styles.projectLink}>
                                    <div className={styles.projectItemInner}>
                                        <h3 className={styles.projectTitle}>
                                            {project.metaData.title}
                                        </h3>
                                        <p className={styles.projectMeta}>
                                            {project.metaData.subtitle}
                                        </p>
                                        <p className={styles.projectDesc}>
                                            {FEATURED_METRICS[project.slug]}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link href="/work/" className={styles.viewAll}>
                        View all projects &rarr;
                    </Link>
                </section>
            </div>
        </>
    )
}

Landing.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export const getStaticProps = async () => {
    const projectsProps = await getMdxIndexContent({ subDir: 'projects' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })

    const featuredProjects = FEATURED_SLUGS
        .map(slug => projectsProps.parsedMdxArray.find(p => p.slug === slug))
        .filter((p): p is ContentIndexData => p !== undefined)

    return {
        props: {
            featuredProjects,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default Landing
