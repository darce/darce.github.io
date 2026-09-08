import { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import { getMdxContent, getMdxIndexContent } from '../lib/getMdxContent'
import { ContentIndexData } from '../types'
import Layout from '../components/layout/Layout'
import PortfolioGroups, { groupPortfolioItems, GroupDefinition } from '../components/features/PortfolioGroups/PortfolioGroups'
import { SITE_URL, SITE_NAME } from '../lib/seo'

const GROUPS: GroupDefinition[] = [
    {
        "id": "independent-products",
        "title": "Independent products",
        "description": "Visual exploration and image description are the focus of these products. I design and build both the interfaces and the software behind them.",
        "slugs": [
            "visual-search-workbench",
            "altcontext"
        ]
    },
    {
        "id": "work-with-teams",
        "title": "Product work with teams",
        "description": "These projects connect working prototypes to production work. They include media interactions, enterprise accessibility, and launch delivery.",
        "slugs": [
            "photoshelter",
            "msnbc",
            "apple"
        ]
    },
    {
        "id": "development-tools",
        "title": "Tools for design and development",
        "description": "Development produces decisions and review findings worth keeping. WorkBay makes those records available to the next coding session.",
        "slugs": [
            "workbay"
        ]
    }
]

interface WorkProps {
    projectsData: ContentIndexData[]
}

const Work: NextPageWithLayout<WorkProps> = ({ projectsData }) => {
    const description = "Product design and front-end development by Daniel Arcé: visual-search and image-description products, work with teams, and development tools."
    const groups = groupPortfolioItems(projectsData, GROUPS, {"id": "more-work", "title": "Further work", "description": "Other projects from my practice."})
    const orderedItems = groups.flatMap(group => group.items)
    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Work',
        itemListElement: orderedItems.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/projects/${item.slug}/`,
            name: item.metaData.title ?? item.slug,
        })),
    }
    return (
        <>
            <Head>
                <title>Work — {SITE_NAME}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`Work — ${SITE_NAME}`} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={`${SITE_URL}/work/`} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
            </Head>
            <PortfolioGroups
                section="projects"
                title="Work"
                description="My work combines interaction design with front-end development. Independent products let me investigate new interactions; product work with teams carries ideas into production; tools for design and development support the decisions made along the way."
                groups={groups}
            />
        </>
    )
}

Work.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export const getStaticProps = async () => {
    const contentProps = await getMdxIndexContent({ subDir: 'projects' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })
    const footerProps = await getMdxContent({ subDir: 'footer' })
    return {
        props: {
            projectsData: contentProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
            footerData: footerProps.parsedMdxArray,
        },
    }
}

export default Work
