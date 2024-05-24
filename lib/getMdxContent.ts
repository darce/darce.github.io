import path from 'path'
import { getMdxFiles, parseMarkdownFile } from './markdownUtils'
import { MarkdownData } from '../types'

interface GetMdxContentArgs {
    subDir: string
}

interface MdxContentProps {
    parsedMdxArray: MarkdownData[]
}

export const getMdxContent = async ({ subDir }: GetMdxContentArgs): Promise<MdxContentProps> => {
    const contentDir = path.join(process.cwd(), 'content', subDir)
    const mdxFiles = getMdxFiles(contentDir)

    const parsedMdxArray = await Promise.all(
        mdxFiles.map(async (filePath) => {
            const slug = path.basename(filePath).replace('.mdx', '')
            const { metaData, mdxSource } = await parseMarkdownFile(filePath)
            const index = typeof metaData.index === 'number' ? metaData.index : null
            /** Return object for each mdx file */
            return {
                slug,
                metaData,
                mdxSource,
                index
            }
        }))

    /** Only sort if index is present in all members of the array */
    if (parsedMdxArray.every(mdx => mdx.index !== null)) {
        parsedMdxArray.sort((a, b) => {
            return (a.index as number) - (b.index as number)
        }
        )
    }

    return {
        parsedMdxArray
    }
}