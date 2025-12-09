import { ReactElement } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import type { NextPageWithLayout } from '../_app'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import { getMdxContent } from '../../lib/getMdxContent'
import { MarkdownData } from '../../types'
import Layout from '../../components/layout/Layout'
import SectionView from '../../components/features/SectionView/SectionView'
import fs from 'fs'
import path from 'path'

/** Supported content sections - add new sections here */
const CONTENT_SECTIONS = ['projects', 'research'] as const
type ContentSection = typeof CONTENT_SECTIONS[number]

interface SectionPageProps {
    section: ContentSection
    selectedItem: MarkdownData
    items: MarkdownData[]
}

const SectionPage: NextPageWithLayout<SectionPageProps> = ({ section, selectedItem, items }) => {
    return (
        <SectionView
            section={section}
            items={items}
            selectedItem={selectedItem}
            autoSelectFirst={false}
        />
    )
}

SectionPage.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    /** return flat array of paths to use in getStaticProps. slug is inferred from filename. */
    const paths = CONTENT_SECTIONS.flatMap(section => {
        const dirPath = path.join('content', section);
        if (!fs.existsSync(dirPath)) return [];

        return fs.readdirSync(dirPath)
            .filter(file => file.endsWith('.mdx'))
            .map((filename) => ({
                params: {
                    section,
                    slug: filename.replace('.mdx', ''),
                }
            }));
    });

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<SectionPageProps> = async ({ params }) => {
    const section = params?.section as ContentSection;
    const slug = params?.slug as string;
    const filePath = path.join('content', section, `${slug}.mdx`)
    const { metaData, mdxSource } = await parseMarkdownFile(filePath)

    // Get header data for Layout
    const headerProps = await getMdxContent({ subDir: 'header' })
    // Get all items for this section's Menu navigation
    const sectionProps = await getMdxContent({ subDir: section })

    return {
        props: {
            section,
            selectedItem: {
                slug,
                metaData,
                mdxSource,
            },
            items: sectionProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        },
    };
};

export default SectionPage;