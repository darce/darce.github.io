import { z } from 'zod'

/** Shared field schemas */
const metaLinkSchema = z.object({
    url: z.string().min(1),
    label: z.string().min(1),
})

const metaImageSchema = z.object({
    src: z.string().min(1),
    alt: z.string().default(''),
    position: z.string().optional(),
    scale: z.number().positive().optional(),
})

/** Base schema — all optional. Used for sections without specific requirements. */
export const baseMetaSchema = z.object({
    index: z.number().finite().optional(),
    year: z.number().finite().optional(),
    title: z.string().trim().min(1).optional(),
    subtitle: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    details: z.string().trim().min(1).optional(),
    links: z.array(metaLinkSchema).min(1).optional(),
    thumbnail: metaImageSchema.optional(),
    images: z.array(metaImageSchema).min(1).optional(),
    tags: z.array(z.string().trim().min(1)).min(1).optional(),
})

/** Projects and research require title + subtitle. */
export const contentItemSchema = baseMetaSchema.extend({
    title: z.string().trim().min(1, 'title is required'),
    subtitle: z.string().trim().min(1, 'subtitle is required'),
})

/** Header requires title + subtitle. */
export const headerSchema = baseMetaSchema.extend({
    title: z.string().trim().min(1, 'title is required'),
    subtitle: z.string().trim().min(1, 'subtitle is required'),
})

/** About only requires images. */
export const aboutSchema = baseMetaSchema.extend({
    images: z.array(metaImageSchema).min(1, 'at least one image is required'),
})

/**
 * Resume and footer use passthrough — their shape is opaque to this schema
 * and gets forwarded as-is to the page component.
 */
export const passthroughSchema = z.record(z.string(), z.unknown())

/** Map section names to their validation schema. */
export const sectionSchemas: Record<string, z.ZodTypeAny> = {
    projects: contentItemSchema,
    research: contentItemSchema,
    header: headerSchema,
    about: aboutSchema,
    resume: passthroughSchema,
    footer: passthroughSchema,
}
