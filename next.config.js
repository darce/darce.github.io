/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    distDir: 'docs',
    trailingSlash: true,
    exportPathMap: async (defaultPathMap, { dev, dir, outDir, distDir, buildId }) => {
        return {
            '/': { page: '/' },
        };
    }
}

module.exports = nextConfig