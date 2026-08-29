const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const matter = require('gray-matter')

const SITE_URL = 'https://darce.xyz'
const SITE_NAME = 'Daniel Arcé'
const SITE_DESCRIPTION = require('../lib/siteMeta.json').description
const CONTACT = {
    email: 'daniel.arce@gmail.com',
    github: 'https://github.com/darce',
    linkedin: 'https://www.linkedin.com/in/danarce/',
}

const CONTENT_DIR = path.join(__dirname, '..', 'content')
const PUBLIC_DIR = path.join(__dirname, '..', 'public')

const STATIC_PAGES = [
    { loc: '/', priority: '1.0', label: 'Home' },
    { loc: '/work/', priority: '0.9', label: 'Index of project case studies' },
    { loc: '/about/', priority: '0.8', label: 'Bio, role focus, strengths' },
    { loc: '/research/', priority: '0.7', label: 'Index of technical writing and experiments' },
    { loc: '/privacy/', priority: '0.3', label: 'Privacy policy' },
]

// ---------------------------------------------------------------------------
// Read content
// ---------------------------------------------------------------------------

function readSection(subDir) {
    const dir = path.join(CONTENT_DIR, subDir)
    if (!fs.existsSync(dir)) return []

    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => {
            const filePath = path.join(dir, f)
            const raw = fs.readFileSync(filePath, 'utf-8')
            const { data, content } = matter(raw)
            const slug = f.replace('.mdx', '')
            return { slug, data, content, section: subDir }
        })
        .sort((a, b) => (a.data.index ?? 0) - (b.data.index ?? 0))
}

function stripMdxComponents(content) {
    return content
        // Remove JSX component tags like <OrderBook />, <Cube />, etc.
        .replace(/<[A-Z][A-Za-z]*\b[^>]*\/>/g, '')
        // AsciiScreen is unwrapped, not dropped. The prose points straight at
        // these drawings ("This is the screen the render exposed:"), so removing
        // them with the other components leaves sentences aimed at nothing, and
        // a machine reader is told a defect is visible in a picture it cannot
        // see. Keep the fence, and keep the label after it as the caption — on
        // the page that label is the figure's accessible name, and here it is
        // the only text saying what the box-drawing depicts.
        .replace(
            /<AsciiScreen\s+label="([^"]*)"\s*>\s*([\s\S]*?)\s*<\/AsciiScreen>/g,
            (_match, label, body) => `${body}\n\n_${label}_`)
        // Remove JSX opening/closing tags
        .replace(/<[A-Z][A-Za-z]*\b[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]*>/g, '')
        // Remove import statements
        .replace(/^import\s+.*$/gm, '')
        // Remove HTML tags like <h2>, <a>, etc. but keep text content
        .replace(/<([a-z][a-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g, '$2')
        .replace(/<([a-z][a-z0-9]*)\b[^>]*\/?>/g, '')
        // Collapse multiple blank lines
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

// ---------------------------------------------------------------------------
// Generate llms.txt
// ---------------------------------------------------------------------------

function generateLlmsTxt(projects, research) {
    const lines = [
        `# ${SITE_URL.replace('https://', '')}`,
        `> Portfolio and case studies for ${SITE_NAME}.`,
        `> ${SITE_DESCRIPTION}`,
        '',
        '## Pages',
        ...STATIC_PAGES
            .filter(p => p.loc !== '/privacy/')
            .map(p => `- ${p.loc} — ${p.label}`),
        '',
        '## Projects',
        ...projects.map(p =>
            `- /projects/${p.slug}/ — ${p.data.description || p.data.title}`
        ),
        '',
        '## Research',
        ...research.map(r =>
            `- /research/${r.slug}/ — ${r.data.description || r.data.title}`
        ),
        '',
        '## Contact',
        `- Email: ${CONTACT.email}`,
        `- GitHub: ${CONTACT.github}`,
        `- LinkedIn: ${CONTACT.linkedin}`,
        '',
    ]
    return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Generate llms-full.txt
// ---------------------------------------------------------------------------

function generateLlmsFullTxt(projects, research, about) {
    const sections = []

    sections.push(`# ${SITE_NAME}`)
    sections.push(SITE_DESCRIPTION)
    sections.push('')

    // About
    if (about.length > 0) {
        sections.push('## About')
        sections.push(stripMdxComponents(about[0].content))
        sections.push('')
    }

    // Projects
    sections.push('## Projects')
    sections.push('')
    for (const p of projects) {
        sections.push(`### ${p.data.title}`)
        if (p.data.subtitle) sections.push(`*${p.data.subtitle}*`)
        if (p.data.year) sections.push(`Year: ${p.data.year}`)
        if (p.data.tags?.length) sections.push(`Tags: ${p.data.tags.join(', ')}`)
        if (p.data.description) sections.push(`Summary: ${p.data.description}`)
        sections.push('')
        sections.push(stripMdxComponents(p.content))
        sections.push('')
    }

    // Research
    sections.push('## Research')
    sections.push('')
    for (const r of research) {
        sections.push(`### ${r.data.title}`)
        if (r.data.subtitle) sections.push(`*${r.data.subtitle}*`)
        if (r.data.tags?.length) sections.push(`Tags: ${r.data.tags.join(', ')}`)
        if (r.data.description) sections.push(`Summary: ${r.data.description}`)
        sections.push('')
        sections.push(stripMdxComponents(r.content))
        sections.push('')
    }

    return sections.join('\n')
}

// ---------------------------------------------------------------------------
// Generate sitemap.xml
// ---------------------------------------------------------------------------

const REPO_ROOT = path.join(__dirname, '..')
const gitDateCache = new Map()

/** Last commit date (YYYY-MM-DD) touching relPath, so lastmod only moves when
 *  the content does. CI must check out full history (fetch-depth: 0) or every
 *  shallow clone collapses these to null. */
function gitLastModified(relPath) {
    if (gitDateCache.has(relPath)) return gitDateCache.get(relPath)
    let date = null
    try {
        date = execSync(`git log -1 --format=%cs -- "${relPath}"`, {
            cwd: REPO_ROOT,
            encoding: 'utf-8',
        }).trim() || null
    } catch {
        date = null
    }
    gitDateCache.set(relPath, date)
    return date
}

function generateSitemap(projects, research) {
    const repoDate = gitLastModified('.')
    const lastmodFor = (relPath) => {
        const date = relPath ? gitLastModified(relPath) : repoDate
        if (date) return date
        console.warn(`sitemap: no git date for ${relPath || 'repo'}, falling back to build date`)
        return new Date().toISOString().split('T')[0]
    }

    const staticPages = STATIC_PAGES.map(p => ({ ...p, lastmod: lastmodFor(null) }))
    const dynamicPages = [
        ...projects.map(p => ({ loc: `/projects/${p.slug}/`, priority: '0.6', lastmod: lastmodFor(`content/projects/${p.slug}.mdx`) })),
        ...research.map(r => ({ loc: `/research/${r.slug}/`, priority: '0.6', lastmod: lastmodFor(`content/research/${r.slug}.mdx`) })),
    ]

    const allPages = [...staticPages, ...dynamicPages]
    const urls = allPages
        .map(({ loc, priority, lastmod }) =>
            `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
        )
        .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const projects = readSection('projects')
const research = readSection('research')
const about = readSection('about')

const llmsTxt = generateLlmsTxt(projects, research)
const llmsFullTxt = generateLlmsFullTxt(projects, research, about)
const sitemap = generateSitemap(projects, research)

fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxt)
fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFullTxt)
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap)

console.log(`Generated llms.txt (${llmsTxt.length} bytes)`)
console.log(`Generated llms-full.txt (${llmsFullTxt.length} bytes)`)
console.log(`Generated sitemap.xml (${STATIC_PAGES.length + projects.length + research.length} URLs)`)
