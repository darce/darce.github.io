import { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import { getMdxIndexContent } from '../lib/getMdxContent'
import { ContentIndexData } from '../types'
import Layout from '../components/layout/Layout'
import SectionCards from '../components/features/SectionCards/SectionCards'
import { SITE_URL, SITE_NAME } from '../lib/seo'

interface WorkProps {
    projectsData: ContentIndexData[]
}

const Work: NextPageWithLayout<WorkProps> = ({ projectsData }) => {
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
            <SectionCards section="projects" items={projectsData} />
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

    return {
        props: {
            projectsData: projectsProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}

export default Work
