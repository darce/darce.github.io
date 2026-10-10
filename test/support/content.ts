import fs from 'node:fs'
import path from 'node:path'

// Inventory independently of the loader so a loader that drops a file cannot shrink coverage.
const sourceFiles = (directory: string) => fs.readdirSync(directory)
    .filter(file => file.endsWith('.mdx')).map(file => path.join(directory, file))

export const articles = (['projects', 'research'] as const).flatMap(section =>
    sourceFiles(path.join(process.cwd(), 'content', section)).map(file => ({
        section, file, slug: path.basename(file, '.mdx'),
    })),
)

export const allContentFiles = fs.readdirSync(path.join(process.cwd(), 'content'), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .flatMap(entry => sourceFiles(path.join(process.cwd(), 'content', entry.name)))

export function expectPublicAssetExists(url: string) {
    const pathname = new URL(url, 'https://portfolio.test').pathname
    const file = path.join(process.cwd(), 'public', decodeURIComponent(pathname))
    if (!fs.existsSync(file)) throw new Error(`Missing local content asset: ${url}`)
}
