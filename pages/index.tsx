import { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import type { NextPageWithLayout } from './_app'
import { getMdxContent, getMdxIndexContent } from '../lib/getMdxContent'
import { ContentIndexData, MetaImage } from '../types'
import Layout from '../components/layout/Layout'
import ResponsiveImage from '../components/common/ResponsiveImage/ResponsiveImage'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, websiteJsonLd } from '../lib/seo'
import styles from '../styles/landingPage.module.scss'

export const FEATURED_SLUGS = ['visual-search-workbench', 'altcontext', 'photoshelter', 'msnbc']

export const FEATURED_METRICS: Record<string, string> = {
    "visual-search-workbench": "Search your photo folders with words or a picture, then follow related images through a map and linked grid. Processing stays on the Mac.",
    "altcontext": "Use the photograph, confirmed identities, and page context to draft an image description. The editor decides what to apply in WordPress. In development.",
    "photoshelter": "A workflow-automation prototype exposed integration issues before production development. My work also included a WCAG audit and front-end accessibility remediation.",
    "msnbc": "Collapsible panels let viewers browse coverage and comments while the video kept playing. I helped take the experience from concept to launch in six months."
}

const FEATURED_TITLES: Record<string, string> = {
    msnbc: 'MSNBC: From Video Concept to Launch',
}

const isStillImage = (src: string): boolean => !/\.gif$/i.test(src)

const heroPriorityAttributes: Record<string, string> = { fetchpriority: 'high' }

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
                                    decoding="async"
                                    {...heroPriorityAttributes}
                                />
                            </picture>
                        </figure>
                        <div className={styles.heroText}>
                            <p className={styles.positioning}>
                                I work across interaction design and front-end development, using working software to explore how people find information and act on it. That practice connects my work at MSNBC and PhotoShelter with my independent products for visual exploration and image description.
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
                        {featuredProjects.map((project, index) => {
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
                                                        <ResponsiveImage
                                                            src={icon.src}
                                                            alt=""
                                                            sizes="120px"
                                                            priority={index < 2}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
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
