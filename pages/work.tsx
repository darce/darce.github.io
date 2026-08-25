import { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import { getMdxContent, getMdxIndexContent } from '../lib/getMdxContent'
import { ContentIndexData } from '../types'
import Layout from '../components/layout/Layout'
import SectionCards from '../components/features/SectionCards/SectionCards'
import { SITE_URL, SITE_NAME } from '../lib/seo'

interface WorkProps {
    projectsData: ContentIndexData[]
}

const Work: NextPageWithLayout<WorkProps> = ({ projectsData }) => {
    const workDescription = 'Product design and design-technology work by Daniel Arcé: the Semantic Image Search AI product, enterprise SaaS, accessibility, and interaction design for Apple, MSNBC, and PhotoShelter.'

    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Projects',
        itemListElement: projectsData.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/projects/${item.slug}/`,
            name: item.metaData.title,
        })),
    }

    return (
        <>
            <Head>
                <title>Work — {SITE_NAME}</title>
                <meta name="description" content={workDescription} />
                <meta property="og:title" content={`Work — ${SITE_NAME}`} />
                <meta property="og:description" content={workDescription} />
                <meta property="og:url" content={`${SITE_URL}/work/`} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
                />
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
    const footerProps = await getMdxContent({ subDir: 'footer' })

    return {
        props: {
            projectsData: projectsProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
            footerData: footerProps.parsedMdxArray,
        }
    }
}

export default Work
