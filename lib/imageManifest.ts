import rawManifest from './generated/image-manifest.json'

export interface ImageCandidate { w: number; src: string }
export interface ImageManifestEntry {
    width: number
    height: number
    hash: string
    avif: ImageCandidate[]
    webp: ImageCandidate[]
    fallback: { type: 'image/jpeg' | 'image/png'; candidates: ImageCandidate[] }
}
export type ImageManifest = Record<string, ImageManifestEntry>

const manifest = rawManifest as ImageManifest

export const getImageEntry = (src: string): ImageManifestEntry | undefined =>
    manifest[src.replace(/^\/+/, '').replace(/\?.*$/, '')]

/** "url 320w, url 480w" — empty string for an empty list */
export const toSrcSet = (candidates: ImageCandidate[]): string =>
    candidates.map((c) => `${c.src} ${c.w}w`).join(', ')

/** smallest candidate with w >= target, else the largest; undefined for empty */
export const pickFallbackSrc = (candidates: ImageCandidate[], target = 640): string | undefined => {
    if (candidates.length === 0) return undefined
    const sorted = [...candidates].sort((a, b) => a.w - b.w)
    return (sorted.find((c) => c.w >= target) ?? sorted[sorted.length - 1]).src
}
