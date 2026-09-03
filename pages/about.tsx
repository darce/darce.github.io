import type { ReactElement, ReactNode } from 'react'
import { useMemo } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import { MarkdownData, MetaImage } from '../types'
import { getMdxContent, getMdxIndexContent } from '../lib/getMdxContent'
import { MDXRemote } from 'next-mdx-remote'
import Layout from '../components/layout/Layout'
import styles from '../styles/aboutPage.module.scss'
import cardStyles from '../components/features/SectionCards/SectionCards.module.scss'
import { SITE_URL, SITE_NAME, personJsonLd } from '../lib/seo'

interface AboutPageProps {
    aboutData: MarkdownData[]
}

interface AboutCardProps {
    label: string
    title: string
    href?: string
    children?: ReactNode
}

// One section of the bio in the Work / Research card idiom: badge, title,
// body. With `href` the whole card is the link (contact); otherwise it is a
// static block whose body may carry inline links.
export const AboutCard = ({ label, title, href, children }: AboutCardProps) => {
    const inner = (
        <div className={styles.cardInner}>
            <p className={cardStyles.cardBadges}>
                <span className={cardStyles.badge}>{label}</span>
            </p>
            <h3 className={cardStyles.cardTitle}>{title}</h3>
            <div className={styles.cardBody}>{children}</div>
        </div>
    )

    if (href) {
        return (
            <a href={href} className={`${styles.card} ${styles.cardLink}`}>
                {inner}
            </a>
        )
    }

    return <section className={`${styles.card} ${styles.cardStatic}`}>{inner}</section>
}

const CardGrid = ({ children }: { children?: ReactNode }) => (
    <div className={cardStyles.cardGrid}>{children}</div>
)

const Headshot = ({ image }: { image: MetaImage }) => (
    <figure className={styles.headshot}>
        <picture>
            <source
                media="(max-width: 768px)"
                srcSet="/images/headshot-dithered-atkinson-120.png"
                width={120}
                height={120}
            />
            <img
                src={`/images/${image.src}`}
                alt={image.alt}
                width={200}
                height={200}
            />
        </picture>
    </figure>
)

const AboutPage: NextPageWithLayout<AboutPageProps> = ({ aboutData }) => {
    const aboutContent = aboutData[0]
    const headShotObj = aboutContent.metaData.images ? aboutContent.metaData.images[0] : null

    const aboutPageDescription = 'About Daniel Arcé — product engineer turning technical complexity into understandable, accessible user-facing systems for AI and data-rich products.'

    const mdxComponents = useMemo(() => ({
        Intro: ({ children }: { children?: ReactNode }) => (
            <section className={styles.intro}>
                {headShotObj && <Headshot image={headShotObj} />}
                <div className={styles.introText}>{children}</div>
            </section>
        ),
        CardGrid,
        AboutCard,
    }), [headShotObj])

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
            <article className={styles.source}>
                <MDXRemote {...aboutContent.mdxSource} components={mdxComponents} />
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
    const footerProps = await getMdxContent({ subDir: 'footer' })

    return {
        props: {
            aboutData: aboutProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
            footerData: footerProps.parsedMdxArray,
        }
    }
}
export default AboutPage
