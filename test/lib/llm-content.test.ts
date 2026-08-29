import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

// public/llms-full.txt is the site rendered for machine readers. It is generated
// by scripts/generate-llm-content.js at prebuild, so it can silently lose content
// whenever the MDX starts using a component the stripper does not understand.

const full = fs.readFileSync(path.join(process.cwd(), 'public/llms-full.txt'), 'utf8')

describe('llms-full.txt keeps the drawings the prose argues from', () => {
    it('carries the process essay ASCII screens', () => {
        // The essay says "This is the screen the render exposed:" and then shows
        // it. Strip the drawing and the sentence points at nothing — the reader
        // is told a defect is visible in a picture that is not there.
        expect(full).toContain('two competing "nothing here yet" messages')
        expect(full).toContain('indexing ───────►  live work first')
        expect(full).toContain('Loading the search model…')
    })

    it('carries the project case ASCII screens', () => {
        expect(full).toContain('┌─ Visual Search Workbench ─')
    })

    it('keeps each drawing next to the label that describes it', () => {
        // The label is the accessible equivalent on the page; for a machine
        // reader it is the only thing that says what the box-drawing depicts.
        expect(full).toMatch(/Search screen as first built:/)
        expect(full).not.toContain('<AsciiScreen')
        expect(full).not.toContain('</AsciiScreen>')
    })
})
