import { ReactElement } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import type { NextPageWithLayout } from './_app'
import { getMdxIndexContent } from '../lib/getMdxContent'
import { ContentIndexData, MetaImage } from '../types'
import Layout from '../components/layout/Layout'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, websiteJsonLd } from '../lib/seo'
import styles from '../styles/landingPage.module.scss'

export const FEATURED_SLUGS = ['semantic-image-search', 'photoshelter', 'workbay', 'msnbc']

export const FEATURED_METRICS: Record<string, string> = {
    'semantic-image-search': 'Native macOS product for semantic search and visual exploration, with on-device processing and explicit states for incomplete data, indexing, model availability, and partial library access.',
    photoshelter: 'Workflow prototyping that exposed integration constraints before production work, plus accessibility remediation tied to $9.2M in institutional ARR.',
    workbay: 'Cross-agent workflow state and adjacent design tooling that stores interaction structure as versioned data before implementation.',
    msnbc: 'Working interface prototypes and reusable components for a live-video product shipped under a six-month deadline.',
}

const isStillImage = (src: string): boolean => !/\.gif$/i.test(src)

export const cardIconFor = (project: ContentIndexData): MetaImage | undefined => {
    const { masthead, thumbnail, images } = project.metaData
    const candidates = [thumbnail, masthead, ...(images ?? [])].filter(
        (image): image is MetaImage => Boolean(image?.src),
    )
    return candidates.find((image) => isStillImage(image.src)) ?? candidates[0]
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
                                I design and build AI and data-rich products where interaction, accessibility, and implementation have to be solved together. My work spans product R&D, interface systems, and working prototypes for media, enterprise software, and independent AI products.
                            </p>
                            <p className={styles.positioning}>
                                Recent work includes a local-first semantic image-search product and design tooling for versioned interaction architecture. Earlier roles include product R&D and accessibility at PhotoShelter and design technology at MSNBC.
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
                        {featuredProjects.map((project) => {
                            const icon = cardIconFor(project)

                            return (
                                <li key={project.slug} className={styles.projectItem}>
                                    <Link href={`/projects/${project.slug}/`} className={styles.projectLink}>
                                        <div className={styles.projectItemInner}>
                                            <div className={styles.projectHead}>
                                                <span
                                                    className={
                                                        icon
                                                            ? styles.projectIcon
                                                            : `${styles.projectIcon} ${styles.projectIconPending}`
                                                    }
                                                    aria-hidden="true"
                                                >
                                                    {icon && (
                                                        <Image
                                                            src={`/images/${icon.src}`}
                                                            alt=""
                                                            width={120}
                                                            height={120}
                                                            sizes="120px"
                                                            style={{
                                                                objectFit: 'cover',
                                                                ...(icon.position
                                                                    ? { objectPosition: icon.position }
                                                                    : {}),
                                                            }}
                                                        />
                                                    )}
                                                </span>
                                                <div className={styles.projectText}>
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
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            )
                        })}
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
