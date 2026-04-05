import { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from '../_app'
import { getMdxIndexContent } from '../../lib/getMdxContent'
import { ContentIndexData } from '../../types'
import Layout from '../../components/layout/Layout'
import SectionCards from '../../components/features/SectionCards/SectionCards'
import { SITE_URL, SITE_NAME } from '../../lib/seo'

interface ResearchProps {
    researchData: ContentIndexData[]
}

const Research: NextPageWithLayout<ResearchProps> = ({ researchData }) => {
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
            <SectionCards section="research" items={researchData} />
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

export const getStaticProps = async () => {
    const researchProps = await getMdxIndexContent({ subDir: 'research' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })

    return {
        props: {
            researchData: researchProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default Research
