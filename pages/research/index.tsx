import { ReactElement } from 'react'
import Head from 'next/head'
import type { NextPageWithLayout } from '../_app'
import { getMdxContent, getMdxIndexContent } from '../../lib/getMdxContent'
import { ContentIndexData } from '../../types'
import Layout from '../../components/layout/Layout'
import PortfolioGroups, { groupPortfolioItems, GroupDefinition } from '../../components/features/PortfolioGroups/PortfolioGroups'
import { SITE_URL, SITE_NAME } from '../../lib/seo'

const GROUPS: GroupDefinition[] = [
    {
        "id": "visual-exploration",
        "title": "Visual exploration",
        "description": "Search, UMAP maps, and linked image grids offer different routes through a photo collection. These studies explain the method and the controls.",
        "slugs": [
            "visual-search-workbench-process",
            "visual-search-workbench-screen-reference"
        ]
    },
    {
        "id": "project-memory",
        "title": "Project memory",
        "description": "Stored decisions and review findings can inform a later coding session. The implementation and field observations are available; a controlled savings comparison is still proposed.",
        "slugs": [
            "agent-memory",
            "interrogating-agent-memory",
            "economics-of-agent-memory"
        ]
    },
    {
        "id": "design-review",
        "title": "Design and engineering review",
        "description": "A critique needs a specific issue and a reason to act. Heuristics Canon connects findings to questions and references that another reviewer can examine.",
        "slugs": [
            "heuristics-canon"
        ]
    }
]

interface ResearchProps {
    researchData: ContentIndexData[]
}

const Research: NextPageWithLayout<ResearchProps> = ({ researchData }) => {
    const description = "Research by Daniel Arcé on visual exploration with UMAP, project memory for coding agents, and source-linked design review."
    const groups = groupPortfolioItems(researchData, GROUPS, {"id": "further-studies", "title": "Further studies", "description": "Other experiments and technical studies."})
    const orderedItems = groups.flatMap(group => group.items)
    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Research',
        itemListElement: orderedItems.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/research/${item.slug}/`,
            name: item.metaData.title ?? item.slug,
        })),
    }
    return (
        <>
            <Head>
                <title>Research — {SITE_NAME}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`Research — ${SITE_NAME}`} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={`${SITE_URL}/research/`} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
            </Head>
            <PortfolioGroups
                section="research"
                title="Research"
                description="Visual search, project memory, and source-linked review recur in my development work. These essays explain their mechanisms, examine observations from my practice, and describe evaluations still to be run. The browser studies make market depth and rotation mathematics interactive."
                groups={groups}
            />
        </>
    )
}

Research.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export const getStaticProps = async () => {
    const contentProps = await getMdxIndexContent({ subDir: 'research' })
    const headerProps = await getMdxIndexContent({ subDir: 'header' })
    const footerProps = await getMdxContent({ subDir: 'footer' })
    return {
        props: {
            researchData: contentProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
            footerData: footerProps.parsedMdxArray,
        },
    }
}

export default Research
