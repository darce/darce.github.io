const fs = require('fs')
const path = require('path')

const SITE_URL = 'https://darce.xyz'
const CONTENT_DIR = path.join(__dirname, '..', 'content')
const OUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml')

const staticPages = [
    { loc: '/', priority: '1.0' },
    { loc: '/about/', priority: '0.8' },
    { loc: '/research/', priority: '0.7' },
    { loc: '/privacy/', priority: '0.3' },
]

function getSlugs(subDir) {
    const dir = path.join(CONTENT_DIR, subDir)
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => f.replace('.mdx', ''))
}

const sections = ['projects', 'research']
const dynamicPages = sections.flatMap(section =>
    getSlugs(section).map(slug => ({
        loc: `/${section}/${slug}/`,
        priority: '0.6',
    }))
)

const today = new Date().toISOString().split('T')[0]

const urls = [...staticPages, ...dynamicPages]
    .map(({ loc, priority }) =>
        `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

fs.writeFileSync(OUT_PATH, sitemap)
console.log(`Sitemap written to ${OUT_PATH} (${staticPages.length + dynamicPages.length} URLs)`)
