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
        "description": "The design article explains the role of UMAP in visual browsing. The interaction reference follows the path from a query to a map selection.",
        "slugs": [
            "visual-search-workbench-process",
            "visual-search-workbench-screen-reference"
        ]
    },
    {
        "id": "project-memory",
        "title": "Project memory",
        "description": "The implementation explains the record. The field note describes its use. The evaluation proposal asks whether that use reduces work.",
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
                description="These articles develop three questions from the work. Visual exploration asks how images can lead to other images. Project memory asks what earlier decisions contribute to a new coding session. Design and engineering review asks how a critique can guide the next change."
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
