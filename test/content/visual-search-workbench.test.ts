import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { contentItemSchema } from '../../lib/schemas'

const file = path.join(process.cwd(), 'content/projects/visual-search-workbench.mdx')

describe('Semantic Image Search case (QM-REPOSITION-01 s2)', () => {
    const raw = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    const { data, content } = matter(raw)

    it('exists with schema-valid frontmatter that sorts first', () => {
        expect(fs.existsSync(file)).toBe(true)
        expect(() => contentItemSchema.parse(data)).not.toThrow()
        expect(data.title).toMatch(/Visual Search Workbench/)
        // "sorts first" means first: every sibling project must sort after it
        const siblings = fs.readdirSync(path.join(process.cwd(), 'content/projects'))
            .filter(f => f.endsWith('.mdx') && f !== 'visual-search-workbench.mdx')
        expect(siblings.length).toBeGreaterThan(0)
        for (const sibling of siblings) {
            const siblingData = matter(fs.readFileSync(
                path.join(process.cwd(), 'content/projects', sibling), 'utf8')).data
            expect(data.index, `${sibling} must sort after visual-search-workbench`)
                .toBeLessThan(siblingData.index)
        }
    })

    it('names every designed incomplete-truth state', () => {
        for (const state of [
            'no folder',
            'no matches',
            'model unavailable',
            'partial library',
            'unavailable volume',
            'experimental',
        ]) {
            expect(content.toLowerCase()).toContain(state)
        }
    })

    it('embeds all eight ASCII screens beside captured screenshots that resolve', () => {
        expect(data.images ?? []).toHaveLength(0)
        // pixel screenshots landed 2026-08-27; the pending note must be gone
        expect(content).not.toMatch(/Screenshots:\s*pending/i)
        expect(content).not.toMatch(/Screens:\s*pending/i)

        // every inline screenshot must resolve to a real file and carry alt text
        const inlineImages = [...content.matchAll(/!\[([^\]]*)\]\((\/images\/[^)\s]+)\)/g)]
        expect(inlineImages.length).toBeGreaterThanOrEqual(6)
        for (const [, alt, src] of inlineImages) {
            expect(alt.trim().length, `${src} needs descriptive alt text`).toBeGreaterThan(20)
            expect(fs.existsSync(path.join(process.cwd(), 'public', src)),
                `${src} must exist under public/`).toBe(true)
        }

        const textFences = content.match(/```text\n[\s\S]*?\n```/g) ?? []
        expect(textFences).toHaveLength(8)

        const screens = [
                  {
                            "screen": 1,
                            "title": "Cold start",
                            "drawing": "┌─ Visual Search Workbench ────────────────────────────────────────────────┐\n│ ┌─ Layers ──────────┐ ┌────────────────────────────────────────────────┐ │\n│ │                   │ │ [ Search query                      ] (Search) │ │\n│ │                   │ │ Choose a folder to search. Your photos stay    │ │\n│ │                   │ │ where they are.                                │ │\n│ │                   │ ├────────────────────────────────────────────────┤ │\n│ │                   │ │                                                │ │\n│ │                   │ │                                                │ │\n│ └───────────────────┘ └────────────────────────────────────────────────┘ │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 2,
                            "title": "Indexing",
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ [ Search query                                          ] (Search)       │\n│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  Embedding 812 of 1284…                   │\n├──────────────────────────────────────────────────────────────────────────┤\n│  ▢ ▢ ▢ ▢ ▢ ▢                                                             │\n│  ▢ ▢ ▢ ▢ ▢ ▢                                                             │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 3,
                            "title": "Semantic results",
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ [ red bicycle                                           ] (Search)       │\n├──────────────────────────────────────────────────────────────────────────┤\n│ ▸ Explore                                                                │\n├──────────────────────────────────────────────────────────────────────────┤\n│ red bicycle                                                              │\n│ 64 search results · nearest 64                                           │\n│  ●  ●  ●  ●  ●  ●                                                        │\n│  ●  ●  ●  ●  ●  ●                                                        │\n│  ●  ●  ●  ●  ●  ●                                                        │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 4,
                            "title": "A photo selected, details open",
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ ┌────────────────┐  IMG_4417.HEIC                                        │\n│ │                │  Selected photo · double-click to open                │\n│ │   [ preview ]  │  ▾ Photo details                                      │\n│ │                │        Size  4032 × 3024                              │\n│ │                │      Camera  Apple iPhone 13 Pro                      │\n│ └────────────────┘        Lens  26 mm f/1.5                              │\n│                          Taken  2021:07:14 18:22:00                      │\n│                            GPS  64.1466°, -21.9426°                      │\n│                                 ┌──────────────────────────┐             │\n│                                 │        ·   ·             │             │\n│                                 │      ────●───────        │             │\n│                                 │            ·             │             │\n│                                 └──────────────────────────┘             │\n├──────────────────────────────────────────────────────────────────────────┤\n│  ●  ●  ●  ●  ●  ●                                                        │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 5,
                            "title": "Explore: Similarity / Places / Timeline",
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore                                                                │\n│ [ Similarity  47 | Places  41 | Timeline  47 ]                           │\n│                              ↑           ↑                               │\n│            41 of the 47 selected photos have coordinates.                │\n│            The gap between those two numbers IS the finding.             │\n└──────────────────────────────────────────────────────────────────────────┘\n\n┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore  [ Similarity  38 | Places  41 | Timeline  41 ]                │\n│ ┌──────────────────────────────────────────────────────────────────────┐ │\n│ │ 90°N ┌──────────────────┬──────────────────┐                         │ │\n│ │      │  ∿∿∿   ·  ∿∿┌─────────────┐∿        │                         │ │\n│ │   0° ├───∿∿───────∿│  ●   ● ●●  ∿│──∿∿─────┤                         │ │\n│ │      │      ∿∿    ∿└─────────────┘∿  · ∿∿  │                         │ │\n│ │ 90°S └──────────────────┴──────────────────┘                         │ │\n│ │      180°W               0°              180°E                       │ │\n│ └──────────────────────────────────────────────────────────────────────┘ │\n│ Mark area   ○ 1 photo   ◯ 312 photos                                     │\n│ Showing 41 of 1284 photos. 1198 have no coordinates, 45 could not be     │\n│ read.                                                                    │\n├──────────────────────────────────────────────────────────────────────────┤\n│ ● Map selection · Showing 41 photos in the map selection. 41 of them are │\n│   not in your search results, so they are listed last rather than ranked.│\n│                                                       ( Clear region )   │\n├──────────────────────────────────────────────────────────────────────────┤\n│  ▣ ▣ ▣ ▣ ▣ ▣   ← 41 tiles, place order, unranked                         │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 6,
                            "title": "Partial-library caveat",
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore                                                                │\n│ [ Similarity | Places | Timeline ]                                       │\n│ ⚠ 312 photos were never opened: their files are on Chimay, which is      │\n│   not plugged in. Dates and places describe the rest of the library,     │\n│   not all of it.                                                         │\n│ ┌──────────────────────────────────────────────────────────────────────┐ │\n│ │      ▁▂▅█▆▃▁    ▁▃▄▂▁      ▂▇█▅▂▁     ▁▂▃▁                           │ │\n│ └──────────────────────────────────────────────────────────────────────┘ │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 7,
                            "title": "Timeline: rest, zoom, truncation",
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore     [ Similarity | Places | Timeline ]                         │\n│ All dates                                                                │\n│ Photos by capture year                             Square-root count scale│\n│ ┌──────────────────────────────────────────────────┐ ┌─────────────────┐ │\n│ │ 1284┤                                            │ │ Off the time    │ │\n│ │  722┤        ▅█                                  │ │ axis            │ │\n│ │  321┤   ▂▅   ██ ▇▅                               │ │      ⁇          │ │\n│ │   80┤ ▁ ██   ██ ██ ▃▁                            │ │      94         │ │\n│ │    0┼─┴──┴───┴┴─┴┴─┴──┴──                        │ │ Undated photos  │ │\n│ │     2019 2020 2021 2022 2023 2024 2025           │ └─────────────────┘ │\n│ └──────────────────────────────────────────────────┘                     │\n│ ⚠ 94 photos have no date and are not on this axis.                       │\n│ ■ EXIF exposure date  ■ File write time  ■ Source unknown                │\n│ 🕐 Bars are calendar periods: one bar per calendar year, cut in GMT       │\n│    (Gregorian).                                                          │\n└──────────────────────────────────────────────────────────────────────────┘\n\n┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore     [ Similarity | Places | Timeline ]                         │\n│ All dates › 2021 › Jul 2021                                 [ Zoom out ] │\n│ Photos by capture day                              Square-root count scale│\n│ 1 July 2021 to 31 July 2021                        [ Zoom to selection ] │\n│ Bars per   Year ○──────────● Day    Day                                  │\n│ ┌──────────────────────────────────────────────────┐ ┌─────────────────┐ │\n│ │   ▃▁  ▂▅█▆▃▁ ▁  0  0  ▁▃▄▂▁   ▂▇█▅▂▁    ▁ ▁▂▃▁   │ │ Off the time    │ │\n│ │                 ╌  ╌                             │ │ axis            │ │\n│ │ 1    5    9   13   17   21   25   29             │ │      ⁇          │ │\n│ └──────────────────────────────────────────────────┘ │      94         │ │\n│                                                      │ Undated photos  │ │\n│                                                      └─────────────────┘ │\n│ ⚠ 94 photos have no date and are not on this axis.                       │\n│ 🕐 Bars are calendar periods: one bar per calendar day, cut in GMT        │\n│    (Gregorian).                                                          │\n└──────────────────────────────────────────────────────────────────────────┘\n\n┌──────────────────────────────────────────────────────────────────────────┐\n│ Photos by capture year                                                   │\n│ ┌──────────────────────────────────────────────────┐                     │\n│ │        ▁▂▅█▆▃▁    ▁▃▄▂▁      ▂▇█▅▂▁     ▁▂▃▁     │                     │\n│ │ 1962 1966 ... 2019 2020 2021 2022 2023 2024 2025 │                     │\n│ └──────────────────────────────────────────────────┘                     │\n│ ⚠ 3 photos dated before 1962 are off the left of this axis.              │\n│                                       [ Before 1962 ]                    │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 8,
                            "title": "Missing model and settings recovery",
                            "drawing": "┌─ Model folder ───────────────────────────────────────────────────────────┐\n│ Where the exported CLIP and MobileSAM packages live. The object detector │\n│ ships inside the app, so detection works even when this folder is        │\n│ missing; search does not.                                                │\n│                                                                          │\n│ /Volumes/Butter/cache/sis-coreml-export                                  │\n│ This folder is not readable — an unmounted disk, or models that were     │\n│ never exported there. Search will report the missing package by name.    │\n│                                                                          │\n│ ( Choose model folder… )   ( Reset to default )                          │\n└──────────────────────────────────────────────────────────────────────────┘\n\n┌─ Settings ───────────────────────────────────────────────────────────────┐\n│ Library folders                                                          │\n│   ~/Pictures/2021-iceland                              (Remove)          │\n│   + Open Folder…                                                         │\n│ ──────────────────────────────────────────────────────────────────────── │\n│ Memory                                                                   │\n│ ──────────────────────────────────────────────────────────────────────── │\n│ Models                                                                   │\n│                                                                          │\n│ Content                                                                  │\n│   No photo is tagged, hidden, blurred, or ranked lower for what it       │\n│   depicts. This app has no explicit-content classifier, so nothing is    │\n│   filtered out and nothing is certified safe — search matches every      │\n│   indexed photo on the same terms, and a generated layer name may        │\n│   describe a photo plainly.                                              │\n│                                                                          │\n│ Local layer names                                                        │\n│   ☐ Ask local Ollama to name unsure layers                               │\n│     Off by default. When on, unsure crops may be sent as a 256px JPEG    │\n│     to Ollama on this Mac (127.0.0.1). Gallery bytes never leave the     │\n│     device.                                                              │\n└──────────────────────────────────────────────────────────────────────────┘"
                  }
        ]

        for (const { screen, title, drawing } of screens) {
            const caption = `**Screen ${screen} — ${title}.**`
            expect(content.split(caption)).toHaveLength(2)

            const fenceStart = content.indexOf('```text\n', content.indexOf(caption) + caption.length)
            expect(fenceStart).toBeGreaterThanOrEqual(0)
            const fenceEnd = content.indexOf('\n```', fenceStart + 8)
            expect(fenceEnd).toBeGreaterThan(fenceStart)
            expect(content.slice(fenceStart, fenceEnd + 4)).toBe('```text\n' + drawing + '\n```')
        }

        expect(content).not.toMatch(/Figure pending/i)
    })

    it('offers the download with the two caveats a reader needs before clicking', () => {
        // The page sends people to a binary. Everything a reasonable person
        // would want to know before running an unsigned app has to be on this
        // side of the click, not only on the far side of it.
        expect(content).toContain('## Download')

        // The link, and the version it claims, pinned together. A stale version
        // beside a "latest" link is the failure that looks fine in review: the
        // link keeps working while the number beside it quietly stops being true.
        const download = content.slice(
            content.indexOf('## Download'),
            content.indexOf('## Problem'),
        )
        // The published link is dl.darce.xyz, not the GitHub URL underneath it.
        // That redirect exists so the bytes can move — different host, different
        // release layout — by editing one line of proxy config instead of every
        // page that ever linked them. Hardcoding the GitHub URL in prose forfeits
        // exactly the property the redirect was built to buy, and a page is the
        // one place where a link outlives the decision that put it there.
        expect(download).toMatch(/\]\(https:\/\/dl\.darce\.xyz\/?\)/)

        // GitHub still has to be *named*, because the digest paragraph below
        // leans on the reader knowing a third party serves the file. A branded
        // redirect that hides whose CDN you are trusting would be worse than
        // the bare link it replaced.
        expect(download).toContain('github.com/darce/visual-search-workbench')
        expect(download).toMatch(/Visual Search Workbench \d+\.\d+\.\d+ for macOS/)

        // The platform floor. "Native macOS" elsewhere on the page does not
        // tell an Intel owner that this build will not start for them.
        expect(download).toMatch(/Apple Silicon/)
        expect(download).toMatch(/macOS 14/)

        // The build is ad-hoc signed and cannot be notarized without a paid
        // membership, so Gatekeeper refuses the first double-click. Saying so
        // here is the difference between a caveat and a bug report.
        expect(download).toMatch(/not notarized/i)
        expect(download).toMatch(/Open Anyway/)

        // A download served by a third party needs an end-to-end digest, and
        // the page has to name the file that carries it (DDIA ch-12).
        expect(download).toContain('SHA256SUMS')
        expect(download).toContain('shasum -a 256 -c')
    })

    it('never tells a reader to strip the quarantine flag', () => {
        // Apple's Open Anyway override is the supported path and leaves the
        // decision inside a system dialog. `xattr -dr com.apple.quarantine` is
        // the same instruction an attacker wants a reader trained to obey, and
        // a portfolio page is exactly where that training would come from.
        expect(raw).not.toMatch(/xattr/i)
    })

    it('keeps the external-user evaluation gap explicit and avoids inflated claims', () => {
        expect(content).toMatch(/not yet run/i)
        // guard the whole file: frontmatter prose (title, description, details)
        // renders too, so it gets no exemption from the trope check
        expect(raw).not.toMatch(/\b(validated|adoption|users love|seamless|leverage)\b/i)
    })
})
