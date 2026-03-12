const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/
})

const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
    reactStrictMode: false,
    output: 'export',
    trailingSlash: true,  // GitHub Pages compatibility
    images: {
        unoptimized: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = withMDX(nextConfig)
