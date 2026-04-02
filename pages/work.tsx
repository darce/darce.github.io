import { ReactElement } from 'react'
import Head from 'next/head'
import path from 'path'
import type { NextPageWithLayout } from './_app'
import { getMdxIndexContent } from '../lib/getMdxContent'
import { parseMarkdownFile } from '../lib/markdownUtils'
import { ContentIndexData, MarkdownData } from '../types'
import Layout from '../components/layout/Layout'
import SectionView from '../components/features/SectionView/SectionView'
import { SITE_URL, SITE_NAME } from '../lib/seo'

interface WorkProps {
    projectsData: ContentIndexData[]
    firstItem: MarkdownData | null
}

const Work: NextPageWithLayout<WorkProps> = ({ projectsData, firstItem }) => {
    const workDescription = 'Selected projects by Daniel Arcé — accessibility, front-end architecture, and product engineering for Apple, MSNBC, PhotoShelter, and more.'

    return (
        <>
            <Head>
                <title>Work — {SITE_NAME}</title>
                <meta name="description" content={workDescription} />
                <meta property="og:title" content={`Work — ${SITE_NAME}`} />
                <meta property="og:description" content={workDescription} />
                <meta property="og:url" content={`${SITE_URL}/work/`} />
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

export const getStaticProps = async () => {
    const projectsProps = await getMdxIndexContent({ subDir: 'projects' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })

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
