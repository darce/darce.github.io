import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

// public/llms-full.txt is the site rendered for machine readers. It is generated
// by scripts/generate-llm-content.js at prebuild, so it can silently lose content
// whenever the MDX starts using a component the stripper does not understand.

const full = fs.readFileSync(path.join(process.cwd(), 'public/llms-full.txt'), 'utf8')

describe('llms-full.txt keeps the drawings the prose argues from', () => {
    it('carries the ASCII screens rather than the component that wraps them', () => {
        // The essay says "This is the screen the render exposed:" and then shows
        // it. Strip the drawing and the sentence points at nothing — the reader
        // is told a defect is visible in a picture that is not there.
        expect(full).toMatch(/[┌└├─│]{4,}/)
        expect(full).not.toContain('<AsciiScreen')
        expect(full).not.toContain('</AsciiScreen>')
    })

    it('unwraps wrapper components instead of dropping their children', () => {
        // The generic JSX stripper drops a component together with its children,
        // which would silently remove whole sections of a page; these unwrap.
        expect(full).not.toMatch(/<\/?(Intro|CardGrid|AboutCard|PullQuote)\b/)
        const about = full.slice(full.indexOf('## About'))
        expect(about.trim().length).toBeGreaterThan(500)
    })
})
