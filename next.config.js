const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/
})

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
    reactStrictMode: false,
    output: 'export',
}

module.exports = withMDX(nextConfig)