import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { SITE_DESCRIPTION } from '../../lib/seo'
import siteMeta from '../../lib/siteMeta.json'

// SITE_DESCRIPTION reaches two build paths: lib/seo.ts (meta description,
// JSON-LD) and scripts/generate-llm-content.js (llms.txt, llms-full.txt).
// Both must draw from lib/siteMeta.json so they cannot drift apart.
describe('site description single source', () => {
    it('lib/seo.ts re-exports the shared description', () => {
        expect(SITE_DESCRIPTION).toBe(siteMeta.description)
    })

    it('the generated llms artifacts carry the shared description', () => {
        for (const artifact of ['llms.txt', 'llms-full.txt']) {
            const text = fs.readFileSync(path.join(process.cwd(), 'public', artifact), 'utf8')
            expect(text, `${artifact} must contain the shared description`).toContain(siteMeta.description)
        }
    })
})
