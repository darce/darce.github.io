const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/
})

// Preview-only: scripts/publish-preview.sh sets NEXT_PUBLIC_PREVIEW_BASE_PATH
// (e.g. "/qm-review-01") so project Pages can resolve /_next assets.
// Unset/empty: production export stays root-relative (byte-identical config).
const previewBasePath = process.env.NEXT_PUBLIC_PREVIEW_BASE_PATH

const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
    reactStrictMode: false,
    output: 'export',
    trailingSlash: true,  // GitHub Pages compatibility
    images: {
        unoptimized: true,
    },
    turbopack: {},
    ...(previewBasePath ? { basePath: previewBasePath, assetPrefix: previewBasePath } : {}),
}

module.exports = withMDX(nextConfig)
