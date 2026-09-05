import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('content asset links', () => {
    it('no MDX links a local file that is not in public/', () => {
        // The résumé PDF went stale in place and stayed linked from every page.
        // Nothing should point at a root-relative file the export does not ship.
        const contentDir = path.join(process.cwd(), 'content')
        const walk = (dir: string): string[] =>
            fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
                const full = path.join(dir, entry.name)
                if (entry.isDirectory()) return walk(full)
                return entry.name.endsWith('.mdx') ? [full] : []
            })

        const missing: string[] = []
        for (const file of walk(contentDir)) {
            const raw = fs.readFileSync(file, 'utf8')
            for (const match of raw.matchAll(/\((\/[^)\s]+\.[a-z0-9]{2,4})\)/gi)) {
                const asset = match[1]
                if (!fs.existsSync(path.join(process.cwd(), 'public', asset))) {
                    missing.push(`${path.relative(process.cwd(), file)} -> ${asset}`)
                }
            }
        }
        expect(missing).toEqual([])
    })
})
