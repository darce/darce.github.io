import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MetaData } from '../types'


/** Get MDX files in a subdirectory
 * @param subDir subdirectory inside 'content'
 * @returns array of .mdx files
 */
export const getMdxFiles = (contentDir: string): string[] => {
    try {
        const curFiles = fs.readdirSync(contentDir)
        const mdxFiles = curFiles
            .filter(file => file.endsWith('.mdx'))
            .map(file => path.join(contentDir, file))
        return mdxFiles
    }
    catch (error) {
        console.error("Error accessing directory:", contentDir, error)
        return []
    }
}

/** Parse markdown file
 * @param filePath
 * @returns front matter & mdx source objects
 */
export const parseMarkdownFile = async (filePath: string): Promise<{ metaData: MetaData; mdxSource: MDXRemoteSerializeResult }> => {
    const markdownWithMeta = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(markdownWithMeta)
    const metaData = data as MetaData

    /** Serialize MDX into HTML */
    const mdxSource = await serialize(content)

    return { metaData, mdxSource }
}
