const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/
})

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
    basePath: isProd ? '/darce.github.io' : '',
    reactStrictMode: false,
    output: 'export',
    /** Add custom rewrites */
    async rewrites() {
        return [
            {
                source: '/work',
                destination: '/',
            }
        ]
    }
}

module.exports = withMDX(nextConfig)