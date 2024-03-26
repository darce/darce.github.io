import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

export interface FrontMatter {
    index: number
    year: number
    title: string
    subtitle: string
    description: string
    details: string
    links: string[]
    images: string[]
    tags: string[]
}

export const parseMarkdownFile = (filePath: string): { frontMatter: FrontMatter; content: string } => {
    const markdownWithMeta = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(markdownWithMeta)

    const frontMatter = data as FrontMatter

    return { frontMatter, content }
}