/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
    basePath: isProd ? '/darce.github.io' : '',
    reactStrictMode: true,
    output: 'export'
}

module.exports = nextConfig