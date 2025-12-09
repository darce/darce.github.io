import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import { MarkdownData } from '../types'
import { getMdxContent } from '../lib/getMdxContent'
import { MDXRemote } from 'next-mdx-remote'
import Layout from '../components/layout/Layout'
import styles from '../styles/aboutPage.module.scss'

interface AboutPageProps {
    aboutData: MarkdownData[]
}

const AboutPage: NextPageWithLayout<AboutPageProps> = ({ aboutData }) => {
    const aboutContent = aboutData[0]
    const headShotObj = aboutContent.metaData.images ? aboutContent.metaData.images[0] : null

    return (
        <main className={`content ${styles.about}`}>
            <aside className={styles.aside}>
                {headShotObj &&
                    (
                        <figure className={styles.headshot}>
                            <img src={`/images/${headShotObj.src}`}
                                alt={headShotObj.alt} />
                        </figure>)
                }

            </aside>
            <article className={styles.source}>
                <MDXRemote {...aboutContent.mdxSource} />
            </article>
        </main>
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
    const headerProps = await getMdxContent({ subDir: 'header' })

    return {
        props: {
            aboutData: aboutProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}
export default AboutPage