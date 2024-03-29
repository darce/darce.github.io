/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    distDir: 'docs',
    trailingSlash: true,
    assetPrefix: isProd ? '/darce.github.io/' : '',
    env: {
        isProd: isProd.toString(),
    },
    exportPathMap: async (defaultPathMap, { dev, dir, outDir, distDir, buildId }) => {
        return {
            '/': { page: '/' },
        };
    }
}

module.exports = nextConfig