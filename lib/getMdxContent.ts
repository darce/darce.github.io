import path from 'path'
import { GetStaticProps } from 'next'
import { getMDXFiles, parseMarkdownFile } from './markdownUtils'
import { MarkdownData } from '../types'

interface ContentProps {
    parsedMDX: MarkdownData[]
}

export const getStaticProps: GetStaticProps<ContentProps> = async (context) => {
    const subDir = context.params?.subDir as string || ''
    const contentDir = path.join('content', subDir)
    const mdxFiles = getMDXFiles(contentDir)

    const parsedMDX = await Promise.all(
        mdxFiles.map(async (filePath) => {
            const fileName = path.basename(filePath)
            const slug = fileName.replace('.mdx', '')
            const { frontMatter, mdxSource } = await parseMarkdownFile(filePath)
            const index = typeof frontMatter.index === 'number' ? frontMatter.index : null
            /** Return object for each mdx file */
            return {
                slug,
                frontMatter,
                mdxSource,
                index
            }
        }))

    /** Only sort if index is present in all members of the array */
    if (parsedMDX.every(mdx => mdx.index !== null)) {
        parsedMDX.sort((a, b) => {
            return (a.index as number) - (b.index as number)
        }
        )
    }

    return {
        props: {
            parsedMDX
        }
    }
}