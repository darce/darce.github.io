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

export interface ProjectData {
    slug: string
    frontMatter: FrontMatter
    content: string
}