import { ReactElement } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import type { NextPageWithLayout } from '../_app'
import { parseMarkdownFile } from '../../lib/markdownUtils'
import { getMdxIndexContent } from '../../lib/getMdxContent'
import { ContentIndexData, MarkdownData } from '../../types'
import Layout from '../../components/layout/Layout'
import SectionView from '../../components/features/SectionView/SectionView'
import { useSwipeNav } from '../../lib/useSwipeNav'
import fs from 'fs'
import path from 'path'
import { ContentSection, buildItemPath } from '../../lib/routes'
import { SITE_URL, SITE_NAME } from '../../lib/seo'

/** Supported content sections - add new sections here */
const CONTENT_SECTIONS = ['projects', 'research'] as const

interface SectionPageProps {
    section: ContentSection
    selectedItem: MarkdownData
    items: ContentIndexData[]
}

const SectionPage: NextPageWithLayout<SectionPageProps> = ({ section, selectedItem, items }) => {
    const title = selectedItem.metaData.title || ''
    const subtitle = selectedItem.metaData.subtitle || ''
    const pageTitle = `${title} — ${SITE_NAME}`
    const pageDescription = subtitle ? `${title}: ${subtitle}` : title
    const pageUrl = `${SITE_URL}/${section}/${selectedItem.slug}/`

    const currentIndex = items.findIndex(item => item.slug === selectedItem.slug)
    const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null
    const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null
    useSwipeNav({
        prev: prevItem ? buildItemPath(section, prevItem.slug) : null,
        next: nextItem ? buildItemPath(section, nextItem.slug) : null,
    })

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={pageUrl} />
            </Head>
            <SectionView
                section={section}
                items={items}
                selectedItem={selectedItem}
            />
        </>
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
    const section = params?.section as ContentSection
    const slug = params?.slug as string
    const filePath = path.join('content', section, `${slug}.mdx`)
    const { metaData, mdxSource } = await parseMarkdownFile(filePath)
    if (!mdxSource) {
        throw new Error(`Expected mdxSource for "${filePath}"`)
    }

    // Get header data for Layout
    const headerProps = await getMdxIndexContent({ subDir: 'header' })
    // Get all items for this section's Menu navigation
    const sectionProps = await getMdxIndexContent({ subDir: section })

    const allItems = sectionProps.parsedMdxArray
    const currentIndex = allItems.findIndex(item => item.slug === slug)
    const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null
    const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

    return {
        props: {
            section,
            selectedItem: {
                slug,
                metaData,
                mdxSource,
            },
            items: allItems,
            headerData: headerProps.parsedMdxArray,
            breadcrumb: metaData.title ?? null,
            breadcrumbPrev: prevItem
                ? { href: `/${section}/${prevItem.slug}`, title: prevItem.metaData.title ?? prevItem.slug }
                : null,
            breadcrumbNext: nextItem
                ? { href: `/${section}/${nextItem.slug}`, title: nextItem.metaData.title ?? nextItem.slug }
                : null,
        },
    }
}

export default SectionPage
