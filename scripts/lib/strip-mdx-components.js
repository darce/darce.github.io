function stripMdxComponents(content) {
    // Protect literal code before interpreting JSX/HTML. Components shown in a
    // code example are evidence, not layout wrappers to remove.
    const codeBlocks = []
    const protectedContent = content.replace(
        /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[ \t]*$/gm,
        block => `\uE000PORTFOLIO_FENCE_${codeBlocks.push(block) - 1}\uE001`,
    )
    return protectedContent
        // A Figure carries editorial evidence, not runtime-only UI. Keep its
        // image alternative, caption, and any prose wrapped beside it.
        .replace(/<Figure\b([^>]*)>/g, (_match, attributes) => {
            const src = attributes.match(/\bsrc="([^"]*)"/)?.[1]
            const alt = attributes.match(/\balt="([^"]*)"/)?.[1]
            const caption = attributes.match(/\bcaption="([^"]*)"/)?.[1]
            return [src && alt ? `![${alt}](/images/${src})` : '', caption ? `*${caption}*` : ''].filter(Boolean).join('\n\n')
        })
        .replace(/<\/Figure>/g, '')
        // The provider supplies runtime state, but its children are the actual
        // explanation. Preserve them in the text export.
        .replace(/<\/?OrderBookProvider\b[^>]*>/g, '')
        // Vector workflows need a textual explanation in the export too.
        .replace(
            /<SearchWorkflow\b[^>]*\blabel="([^"]*)"[^>]*>\s*([\s\S]*?)\s*<\/SearchWorkflow>/g,
            (_match, label, caption) => `${label}\n\n_${caption}_`)
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
        // The About page is authored as cards. Intro and CardGrid are layout
        // wrappers; an AboutCard is a titled section of the bio. Unwrap them
        // so the prose survives instead of being dropped with the tags.
        .replace(
            /<AboutCard\b[^>]*\btitle="([^"]*)"[^>]*>\s*([\s\S]*?)\s*<\/AboutCard>/g,
            (_match, title, body) => `### ${title}\n\n${body}`)
        .replace(/<\/?(Intro|CardGrid)>/g, '')
        // Remove JSX opening/closing tags
        .replace(/<[A-Z][A-Za-z]*\b[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]*>/g, '')
        // Remove import statements
        .replace(/^import\s+.*$/gm, '')
        // Remove HTML tags like <h2>, <a>, etc. but keep text content
        .replace(/<([a-z][a-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g, '$2')
        .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*\/?>/g, '')
        // Collapse multiple blank lines
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .replace(/\uE000PORTFOLIO_FENCE_(\d+)\uE001/g,
            (_match, index) => codeBlocks[Number(index)])
}

module.exports = { stripMdxComponents }
