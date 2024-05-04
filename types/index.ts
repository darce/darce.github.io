
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface FrontMatter {
    index: number
    year: number
    title: string
    subtitle: string
    description: string
    details: string
    links?:
    {
        url: string,
        label: string
    }[]
    images?: {
        src: string,
        alt: string
    }[]
    tags?: string[]
}

export interface MarkdownData {
    slug: string
    frontMatter: FrontMatter
    mdxSource: MDXRemoteSerializeResult
}