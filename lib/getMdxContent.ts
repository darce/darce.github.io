import path from 'path'

import { getMdxFiles, parseMarkdownFile } from './markdownUtils'
import { ContentIndexData, MarkdownData } from '../types'

interface GetMdxContentArgs {
    subDir: string
}

interface MdxContentProps {
    parsedMdxArray: MarkdownData[]
}

interface MdxIndexContentProps {
    parsedMdxArray: ContentIndexData[]
}

const sortByIndex = <T extends { metaData: { index?: number } }>(items: T[]): T[] =>
    [...items].sort((a, b) => (a.metaData.index ?? 0) - (b.metaData.index ?? 0))

export const getMdxContent = async ({ subDir }: GetMdxContentArgs): Promise<MdxContentProps> => {
    const contentDir = path.join(process.cwd(), 'content', subDir)
    const mdxFiles = getMdxFiles(contentDir)

    const mdxArray = await Promise.all(
        mdxFiles.map(async (filePath) => {
            const slug = path.basename(filePath).replace('.mdx', '')
            const { metaData, mdxSource } = await parseMarkdownFile(filePath)
            if (!mdxSource) {
                return null
            }

            return {
                slug,
                metaData,
                mdxSource,
            }
        }),
    )

    const parsedMdxArray = sortByIndex(
        mdxArray.filter((mdx): mdx is MarkdownData => mdx !== null),
    )

    return {
        parsedMdxArray,
    }
}

export const getMdxIndexContent = async ({
    subDir,
}: GetMdxContentArgs): Promise<MdxIndexContentProps> => {
    const contentDir = path.join(process.cwd(), 'content', subDir)
    const mdxFiles = getMdxFiles(contentDir)

    const mdxArray = await Promise.all(
        mdxFiles.map(async (filePath) => {
            const slug = path.basename(filePath).replace('.mdx', '')
            const { metaData } = await parseMarkdownFile(filePath, { includeSource: false })
            return {
                slug,
                metaData,
            }
        }),
    )

    return {
        parsedMdxArray: sortByIndex(mdxArray),
    }
}
