import { ReactElement } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import type { NextPageWithLayout } from './_app'
import { getMdxContent, getMdxIndexContent } from '../lib/getMdxContent'
import { ContentIndexData, MetaImage } from '../types'
import Layout from '../components/layout/Layout'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, websiteJsonLd } from '../lib/seo'
import styles from '../styles/landingPage.module.scss'

export const FEATURED_SLUGS = ['photoshelter', 'msnbc', 'visual-search-workbench', 'altcontext']

export const FEATURED_METRICS: Record<string, string> = {
    photoshelter: 'Production accessibility work: custom keyboard navigation across Web Components and Shadow DOM, audit remediation, and mentoring four developers. A workflow prototype informed Smart Galleries.',
    msnbc: 'I proposed and prototyped collapsible panels around continuous video playback, then helped deliver the AngularJS interface with the internal team and vendors.',
    'visual-search-workbench': 'Start with words or a picture, choose a promising image, and follow it through a similarity map and linked grid. Released for macOS, with on-device processing.',
    altcontext: 'Draft image descriptions from the photograph, face suggestions, and page context. The editor reviews the identity and wording before applying stored text in WordPress. In development.',
}

const FEATURED_TITLES: Record<string, string> = {
    msnbc: 'MSNBC: Continuous Video Playback',
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
                                I build accessible interfaces and working prototypes. My work spans media products, photo archives, and tools for finding and describing images. At PhotoShelter and MSNBC, I carried interaction decisions into production code.
                            </p>
                            <a className={styles.cta} href="mailto:daniel.arce@gmail.com">
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
                                                    className={icon ? styles.projectIcon : `${styles.projectIcon} ${styles.projectIconPending}`}
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
                                                                ...(icon.position ? { objectPosition: icon.position } : {}),
                                                            }}
                                                        />
                                                    )}
                                                </span>
                                                <div className={styles.projectText}>
                                                    <h3 className={styles.projectTitle}>
                                                        {FEATURED_TITLES[project.slug] ?? project.metaData.title}
                                                    </h3>
                                                    <p className={styles.projectMeta}>{project.metaData.subtitle}</p>
                                                    <p className={styles.projectDesc}>{FEATURED_METRICS[project.slug]}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    <Link href="/work/" className={styles.viewAll}>View all projects &rarr;</Link>
                </section>
            </div>
        </>
    )
}

Landing.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export const getStaticProps = async () => {
    const projectsProps = await getMdxIndexContent({ subDir: 'projects' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })
    const footerProps = await getMdxContent({ subDir: 'footer' })
    const featuredProjects = FEATURED_SLUGS
        .map(slug => projectsProps.parsedMdxArray.find(p => p.slug === slug))
        .filter((p): p is ContentIndexData => p !== undefined)
    return {
        props: {
            featuredProjects,
            headerData: headerProps.parsedMdxArray,
            footerData: footerProps.parsedMdxArray,
        },
    }
}

export default Landing
