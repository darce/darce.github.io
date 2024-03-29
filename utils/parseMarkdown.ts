import matter from 'gray-matter'
import fs from 'fs'
import { FrontMatter } from '../types'

export const parseMarkdownFile = (filePath: string): { frontMatter: FrontMatter; content: string } => {
    const markdownWithMeta = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(markdownWithMeta)
    const frontMatter = data as FrontMatter

    return { frontMatter, content }
}