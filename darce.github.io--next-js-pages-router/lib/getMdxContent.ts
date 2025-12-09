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

    const mdxArray = await Promise.all(
        mdxFiles.map(async (filePath) => {
            if(!filePath || typeof filePath !== 'string') {
                console.warn('** Invalid file path:', filePath);
                return null;
            }

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
        }));

    const parsedMdxArray = mdxArray.filter(mdx => mdx !== null) as MarkdownData[]
    /** Only sort if index is present in all members of the array */
    if (parsedMdxArray.every(mdx => mdx.metaData.index !== null)) {
        parsedMdxArray.sort((a, b) => {
            return (a.metaData.index as number) - (b.metaData.index as number)
        }
        )
    }

    return {
        parsedMdxArray
    }
}