import { ReactElement } from 'react'
import Head from 'next/head'
import path from 'path'
import type { NextPageWithLayout } from './_app'
import { getMdxIndexContent } from '../lib/getMdxContent'
import { parseMarkdownFile } from '../lib/markdownUtils'
import { ContentIndexData, MarkdownData } from '../types'
import Layout from '../components/layout/Layout'
import SectionView from '../components/features/SectionView/SectionView'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, websiteJsonLd } from '../lib/seo'

interface WorkProps {
    projectsData: ContentIndexData[]
    firstItem: MarkdownData | null
}

const Work: NextPageWithLayout<WorkProps> = ({ projectsData, firstItem }) => {
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
            <SectionView
                section="projects"
                items={projectsData}
                selectedItem={firstItem}
                hideDetailOnMobile
            />
        </>
    )
}

Work.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build to get data from mdx files*/
export const getStaticProps = async () => {
    const projectsProps = await getMdxIndexContent({ subDir: 'projects' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })

    // Fetch first item's full MDX for the desktop detail pane
    let firstItem: MarkdownData | null = null
    const first = projectsProps.parsedMdxArray[0]
    if (first) {
        const filePath = path.join('content', 'projects', `${first.slug}.mdx`)
        const { metaData, mdxSource } = await parseMarkdownFile(filePath)
        if (mdxSource) {
            firstItem = { slug: first.slug, metaData, mdxSource }
        }
    }

    return {
        props: {
            projectsData: projectsProps.parsedMdxArray,
            firstItem,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default Work
