import React, { CSSProperties } from 'react'
import { getImageEntry, pickFallbackSrc, toSrcSet } from '../../../lib/imageManifest'

interface ResponsiveImageProps {
    /** manifest key / path under /images, e.g. 'research/foo.jpg' */
    src: string
    alt: string
    sizes: string
    /** Intrinsic dimensions for originals outside the generated manifest, such as GIFs. */
    width?: number
    height?: number
    /** above the fold: eager + fetchpriority=high */
    priority?: boolean
    className?: string
    style?: CSSProperties
    onError?: () => void
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
    src,
    alt,
    sizes,
    width,
    height,
    priority = false,
    className,
    style,
    onError,
}) => {
    const entry = getImageEntry(src)
    const priorityAttributes: Record<string, string> = priority ? { fetchpriority: 'high' } : {}
    const commonAttributes = {
        alt,
        loading: priority ? 'eager' as const : 'lazy' as const,
        decoding: 'async' as const,
        className,
        style,
        onError,
        ...priorityAttributes,
    }

    if (!entry) {
        return <img src={`/images/${src}`} width={width} height={height} {...commonAttributes} />
    }

    return (
        <picture>
            {entry.avif.length > 0 && (
                <source type="image/avif" srcSet={toSrcSet(entry.avif)} sizes={sizes} />
            )}
            {entry.webp.length > 0 && (
                <source type="image/webp" srcSet={toSrcSet(entry.webp)} sizes={sizes} />
            )}
            <img
                src={pickFallbackSrc(entry.fallback.candidates)}
                srcSet={toSrcSet(entry.fallback.candidates)}
                sizes={sizes}
                width={entry.width}
                height={entry.height}
                {...commonAttributes}
            />
        </picture>
    )
}

export default ResponsiveImage
