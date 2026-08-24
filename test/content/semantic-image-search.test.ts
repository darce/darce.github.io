import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { contentItemSchema } from '../../lib/schemas'

const file = path.join(process.cwd(), 'content/projects/semantic-image-search.mdx')

describe('Semantic Image Search case (QM-REPOSITION-01 s2)', () => {
    const raw = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    const { data, content } = matter(raw)

    it('exists with schema-valid frontmatter that sorts first', () => {
        expect(fs.existsSync(file)).toBe(true)
        expect(() => contentItemSchema.parse(data)).not.toThrow()
        expect(data.index).toBeLessThan(5)
        expect(data.title).toMatch(/Semantic Image Search/)
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

    it('embeds all eight ASCII screens while declaring pixel screenshots pending', () => {
        expect(data.images ?? []).toHaveLength(0)
        expect(content).toMatch(/Screenshots:\s*pending/i)
        expect(content).not.toMatch(/Screens:\s*pending/i)

        const textFences = content.match(/```text\n[\s\S]*?\n```/g) ?? []
        expect(textFences).toHaveLength(8)

        const screens = [
                  {
                            "screen": 1,
                            "title": "Cold start",
                            "drawing": "┌─ Semantic Image Search ──────────────────────────────────────────────────┐\n│ ┌─ Layers ──────────┐ ┌────────────────────────────────────────────────┐ │\n│ │                   │ │ [ Search query                      ] (Search) │ │\n│ │  No layer packs   │ │ No folder yet. Use File → Open Folder to        │ │\n│ │  yet.             │ │ enroll photos, then search here.               │ │\n│ │                   │ ├────────────────────────────────────────────────┤ │\n│ │                   │ │                                                │ │\n│ │                   │ │                                                │ │\n│ └───────────────────┘ └────────────────────────────────────────────────┘ │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 2,
                            "title": "Indexing",
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ [ Search query                                          ] (Search)       │\n│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  Embedding 812 of 1,284                   │\n├──────────────────────────────────────────────────────────────────────────┤\n│  ▢ ▢ ▢ ▢ ▢ ▢                                                             │\n│  ▢ ▢ ▢ ▢ ▢ ▢                                                             │\n└──────────────────────────────────────────────────────────────────────────┘"
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
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore                                                                │\n│ [ Similarity  47 | Places  41 | Timeline  47 ]                           │\n│                              ↑           ↑                               │\n│            41 of the 47 selected photos have coordinates.                │\n│            The gap between those two numbers IS the finding.             │\n└──────────────────────────────────────────────────────────────────────────┘\n\n┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore  [ Similarity  38 | Places  41 | Timeline  41 ]                │\n│ ┌──────────────────────────────────────────────────────────────────────┐ │\n│ │ 90°N ┌──────────────────┬──────────────────┐                         │ │\n│ │      │  ∿∿∿   ·  ∿∿┌─────────────┐∿        │                         │ │\n│ │   0° ├───∿∿───────∿│  ●   ● ●●  ∿│──∿∿─────┤                         │ │\n│ │      │      ∿∿    ∿└─────────────┘∿  · ∿∿  │                         │ │\n│ │ 90°S └──────────────────┴──────────────────┘                         │ │\n│ │      180°W               0°              180°E                       │ │\n│ └──────────────────────────────────────────────────────────────────────┘ │\n│ Mark area   ○ 1 photo   ◯ 312 photos                                     │\n│ Showing 41 of 1,284 photos. 1,198 have no coordinates, 45 could not be   │\n│ read.                                                                    │\n├──────────────────────────────────────────────────────────────────────────┤\n│ ● Map selection · Showing 41 photos in the map selection. 41 of them are │\n│   not in your search results, so they are listed last rather than ranked.│\n│                                                       ( Clear region )   │\n├──────────────────────────────────────────────────────────────────────────┤\n│  ▣ ▣ ▣ ▣ ▣ ▣   ← 41 tiles, place order, unranked                         │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 6,
                            "title": "Partial-library caveat",
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore                                                                │\n│ [ Similarity | Places | Timeline ]                                       │\n│ ⚠ 312 photos were never opened: their files are not where the library    │\n│   says they are, usually a volume that is not plugged in. Dates and      │\n│   places describe the rest of the library, not all of it.                │\n│ ┌──────────────────────────────────────────────────────────────────────┐ │\n│ │      ▁▂▅█▆▃▁    ▁▃▄▂▁      ▂▇█▅▂▁     ▁▂▃▁                           │ │\n│ └──────────────────────────────────────────────────────────────────────┘ │\n└──────────────────────────────────────────────────────────────────────────┘"
                  },
                  {
                            "screen": 7,
                            "title": "Timeline: rest, zoom, truncation",
                            "drawing": "┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore     [ Similarity | Places | Timeline ]                         │\n│ All dates                                                                │\n│ Photos by capture year                             Square-root count scale│\n│ ┌──────────────────────────────────────────────────┐ ┌─────────────────┐ │\n│ │ 1284┤                                            │ │ Off the time    │ │\n│ │  722┤        ▅█                                  │ │ axis            │ │\n│ │  321┤   ▂▅   ██ ▇▅                               │ │      ⁇          │ │\n│ │   80┤ ▁ ██   ██ ██ ▃▁                            │ │      94         │ │\n│ │    0┼─┴──┴───┴┴─┴┴─┴──┴──                        │ │ Undated photos  │ │\n│ │     2019 2020 2021 2022 2023 2024 2025           │ └─────────────────┘ │\n│ └──────────────────────────────────────────────────┘                     │\n│ ⚠ 94 photos have no capture date.                                        │\n│ ⓘ 1,190 dated: 1,104 from exposure time, 86 from file write time.        │\n│ 🕐 Bars are calendar periods: one bar per calendar year, cut in GMT       │\n│    (Gregorian).                                                          │\n└──────────────────────────────────────────────────────────────────────────┘\n\n┌──────────────────────────────────────────────────────────────────────────┐\n│ ▾ Explore     [ Similarity | Places | Timeline ]                         │\n│ All dates › 2021 › Jul 2021                                 [ Zoom out ] │\n│ Photos by capture day                              Square-root count scale│\n│ 1 July 2021 to 31 July 2021                        [ Zoom to selection ] │\n│ Bars per   Year ○──────────● Day    Day                                  │\n│ ┌──────────────────────────────────────────────────┐ ┌─────────────────┐ │\n│ │   ▃▁  ▂▅█▆▃▁ ▁  0  0  ▁▃▄▂▁   ▂▇█▅▂▁    ▁ ▁▂▃▁   │ │ Off the time    │ │\n│ │                 ╌  ╌                             │ │ axis            │ │\n│ │ 1    5    9   13   17   21   25   29             │ │      ⁇          │ │\n│ └──────────────────────────────────────────────────┘ │      94         │ │\n│                                                      │ Undated photos  │ │\n│                                                      └─────────────────┘ │\n│ ⚠ 94 photos have no capture date.                                        │\n│ 🕐 Bars are calendar periods: one bar per calendar day, cut in GMT.       │\n└──────────────────────────────────────────────────────────────────────────┘\n\n┌──────────────────────────────────────────────────────────────────────────┐\n│ Photos by capture year                                                   │\n│ ┌──────────────────────────────────────────────────┐                     │\n│ │        ▁▂▅█▆▃▁    ▁▃▄▂▁      ▂▇█▅▂▁     ▁▂▃▁     │                     │\n│ │ 1962 1966 ... 2019 2020 2021 2022 2023 2024 2025 │                     │\n│ └──────────────────────────────────────────────────┘                     │\n│ ⚠ 3 photos dated before 1962 are off the left of this axis.              │\n│                                       [ Before 1962 ]                    │\n└──────────────────────────────────────────────────────────────────────────┘"
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

    it('keeps the external-user evaluation gap explicit and avoids inflated claims', () => {
        expect(content).toMatch(/not yet run/i)
        expect(content).not.toMatch(/\b(validated|adoption|users love|seamless|leverage)\b/i)
    })
})
