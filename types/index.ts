
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface MetaData {
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
    metaData: MetaData
    mdxSource: MDXRemoteSerializeResult
}