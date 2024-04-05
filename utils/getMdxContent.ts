import fs from 'fs'
import path from 'path'
import { GetStaticProps } from "next"
import { parseMarkdownFile } from "./parseMarkdown"
import { ProjectData } from '../types'

interface ContentProps {
    projects: ProjectData[]
}

export const getStaticProps: GetStaticProps<ContentProps> = async () => {
    const mdxFiles = fs.readdirSync(path.join('content'))

    const projects = await Promise.all(
        mdxFiles.map(async (curFileName) => {
            const slug = curFileName.replace('.mdx', '')
            const curFilePath = path.join('content', curFileName)
            const { frontMatter, mdxSource } = await parseMarkdownFile(curFilePath)

            /** Return object for each mdx file */
            return {
                slug,
                frontMatter,
                mdxSource
            }
        }))

    return {
        props: {
            projects
        }
    }
}