import { ReactElement } from 'react'
import Head from 'next/head'
import path from 'path'
import type { NextPageWithLayout } from '../_app'
import { getMdxIndexContent } from '../../lib/getMdxContent'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import { ContentIndexData, MarkdownData } from '../../types'
import Layout from '../../components/layout/Layout'
import SectionView from '../../components/features/SectionView/SectionView'
import { SITE_URL, SITE_NAME } from '../../lib/seo'

interface ResearchProps {
    researchData: ContentIndexData[]
    firstItem: MarkdownData | null
}

const Research: NextPageWithLayout<ResearchProps> = ({ researchData, firstItem }) => {
    const researchDescription = 'Research and technical explorations by Daniel Arcé — order book visualization, 3D rotation matrices, and front-end engineering experiments.'

    return (
        <>
            <Head>
                <title>Research — {SITE_NAME}</title>
                <meta name="description" content={researchDescription} />
                <meta property="og:title" content={`Research — ${SITE_NAME}`} />
                <meta property="og:description" content={researchDescription} />
                <meta property="og:url" content={`${SITE_URL}/research/`} />
            </Head>
            <SectionView
                section="research"
                items={researchData}
                selectedItem={firstItem}
                hideDetailOnMobile
            />
        </>
    )
}

Research.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build to get data from mdx files*/
export const getStaticProps = async () => {
    const researchProps = await getMdxIndexContent({ subDir: 'research' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })

    // Fetch first item's full MDX for the desktop detail pane
    let firstItem: MarkdownData | null = null
    const first = researchProps.parsedMdxArray[0]
    if (first) {
        const filePath = path.join('content', 'research', `${first.slug}.mdx`)
        const { metaData, mdxSource } = await parseMarkdownFile(filePath)
        if (mdxSource) {
            firstItem = { slug: first.slug, metaData, mdxSource }
        }
    }

    return {
        props: {
            researchData: researchProps.parsedMdxArray,
            firstItem,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default Research
