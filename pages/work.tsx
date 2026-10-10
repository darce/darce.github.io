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
        id: 'work-with-teams',
        title: 'Production work with teams',
        description: 'Front-end implementation, keyboard interaction, and prototypes carried into production with internal teams and external partners.',
        slugs: ['photoshelter', 'msnbc', 'apple'],
    },
    {
        id: 'independent-products',
        title: 'Independent applications',
        description: 'Visual Search Workbench is released for macOS. AltContext is in development. I design and build their interfaces and supporting software.',
        slugs: ['visual-search-workbench', 'altcontext'],
    },
    {
        id: 'archives-and-exhibitions',
        title: 'Archives and exhibitions',
        description: 'Web and exhibition experiences built around material supplied by photographers and filmmakers.',
        slugs: ['texting-syria', 'barbarabeirne', 'bauhausdances'],
    },
    {
        id: 'development-tools',
        title: 'Development tools',
        description: 'WorkBay keeps coding tasks, decisions, and review evidence retrievable across sessions in my own practice.',
        slugs: ['workbay'],
    },
]

interface WorkProps {
    projectsData: ContentIndexData[]
}

const Work: NextPageWithLayout<WorkProps> = ({ projectsData }) => {
    const description = "Front-end development by Daniel Arcé: production interfaces, accessibility, independent image applications, archives, and exhibition experiences."
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
                description="I develop production interfaces and use working prototypes to make interaction decisions. These projects cover work with teams, independent applications, archives, and exhibition experiences."
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
