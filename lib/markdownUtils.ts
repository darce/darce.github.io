import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MetaData } from '../types'
import { ZodError } from 'zod'
import { sectionSchemas, passthroughSchema } from './schemas'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

// Unified plugin typing is noisy across remark/rehype plugin packages.
// The pipeline is build-time only and validated by Next build/typecheck.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remarkPlugins: any[] = [remarkMath, remarkGfm]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rehypePlugins: any[] = [rehypeKatex, rehypeHighlight]

interface ParseMarkdownOptions {
    includeSource?: boolean
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const isString = (value: unknown): value is string => typeof value === 'string'

const asOptionalString = (value: unknown): string | undefined => {
    if (!isString(value)) {
        return undefined
    }
    const normalized = value.trim()
    return normalized.length > 0 ? normalized : undefined
}

const asOptionalNumber = (value: unknown): number | undefined => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return undefined
    }
    return value
}

const asOptionalStringArray = (value: unknown): string[] | undefined => {
    if (!Array.isArray(value)) {
        return undefined
    }
    const values = value.filter(isString).map((entry) => entry.trim()).filter((entry) => entry.length > 0)
    return values.length > 0 ? values : undefined
}

const asMetaLinks = (value: unknown): MetaData['links'] => {
    if (!Array.isArray(value)) {
        return undefined
    }
    const links = value
        .filter(isRecord)
        .map((entry) => ({
            url: asOptionalString(entry.url) ?? '',
            label: asOptionalString(entry.label) ?? '',
        }))
        .filter((entry) => entry.url.length > 0 || entry.label.length > 0)
    return links.length > 0 ? links : undefined
}

const asMetaImages = (value: unknown): MetaData['images'] => {
    if (!Array.isArray(value)) {
        return undefined
    }
    const images = value
        .filter(isRecord)
        .map((entry) => ({
            src: asOptionalString(entry.src) ?? '',
            alt: asOptionalString(entry.alt) ?? '',
        }))
        .filter((entry) => entry.src.length > 0)
    return images.length > 0 ? images : undefined
}

const sectionFromFilePath = (filePath: string): string => {
    const normalized = path.normalize(filePath)
    const tokens = normalized.split(path.sep)
    const contentIndex = tokens.lastIndexOf('content')
    return contentIndex >= 0 && tokens[contentIndex + 1] ? tokens[contentIndex + 1] : ''
}

const sanitizeForStaticProps = <T>(value: T): T =>
    JSON.parse(JSON.stringify(value)) as T

const normalizeMetaData = (rawData: unknown, filePath: string): MetaData => {
    if (!isRecord(rawData)) {
        throw new Error(`Invalid frontmatter in "${filePath}": expected an object`)
    }

    const section = sectionFromFilePath(filePath)

    // Resume and footer use passthrough — their shape is opaque
    if (section === 'resume' || section === 'footer') {
        return sanitizeForStaticProps(rawData as MetaData)
    }

    // Pre-normalize gray-matter output into clean types before validation
    const normalized: Record<string, unknown> = {}
    const asMetaThumbnail = (value: unknown): MetaData['thumbnail'] => {
        if (!isRecord(value)) return undefined
        const src = asOptionalString(value.src)
        if (!src) return undefined
        const result: NonNullable<MetaData['thumbnail']> = { src, alt: asOptionalString(value.alt) ?? '' }
        const position = asOptionalString(value.position)
        if (position) result.position = position
        const scale = asOptionalNumber(value.scale)
        if (scale) result.scale = scale
        return result
    }

    const fieldNormalizers: Array<[string, (v: unknown) => unknown]> = [
        ['index', asOptionalNumber],
        ['year', asOptionalNumber],
        ['title', asOptionalString],
        ['subtitle', asOptionalString],
        ['description', asOptionalString],
        ['details', asOptionalString],
        ['links', asMetaLinks],
        ['thumbnail', asMetaThumbnail],
        ['images', asMetaImages],
        ['tags', asOptionalStringArray],
    ]

    for (const [key, normalize] of fieldNormalizers) {
        const value = normalize(rawData[key])
        if (value !== undefined) {
            normalized[key] = value
        }
    }

    // Validate against the section-specific Zod schema
    const schema = sectionSchemas[section] ?? passthroughSchema
    try {
        const validated = schema.parse(normalized)
        return sanitizeForStaticProps(validated as MetaData)
    } catch (err) {
        if (err instanceof ZodError) {
            const issues = err.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n')
            throw new Error(`Invalid frontmatter in "${filePath}":\n${issues}`)
        }
        throw err
    }
}


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
export const parseMarkdownFile = async (
    filePath: string,
    options: ParseMarkdownOptions = {},
): Promise<{ metaData: MetaData; mdxSource?: MDXRemoteSerializeResult }> => {
    const markdownWithMeta = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(markdownWithMeta)
    const metaData = normalizeMetaData(data, filePath)

    if (options.includeSource === false) {
        return { metaData }
    }

    /** Serialize MDX into HTML */
    const mdxSource = await serialize(content, {
        mdxOptions: {
            remarkPlugins,
            rehypePlugins,
        },
    })

    return { metaData, mdxSource }
}
