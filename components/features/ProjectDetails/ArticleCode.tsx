import React from 'react'

export const CodeIsIllustration = React.createContext(false)

// Highlighting introduces nested spans. Measure their literal text rather
// than language, line count, or serialized markup; never rewrite the code.
function textContent(node: React.ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') return String(node)
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textContent(node.props.children)
    return React.Children.toArray(node).map(textContent).join('')
}

const ArticleCode = ({ children, onKeyDown, ...props }: React.ComponentPropsWithoutRef<'pre'>) => {
    const illustration = React.useContext(CodeIsIllustration)
    const columns = Math.max(0, ...textContent(children).split('\n').map(line => {
        let column = 0
        for (const character of line) column += character === '\t' ? 4 - column % 4 : 1
        return column
    }))
    // A 68-column lower bound includes lines just below 80, plus padding.
    // The intrinsic branch still stacks when the canvas cannot fit prose.
    return <pre {...props} data-code-columns={columns} data-code-layout={columns >= 68 ? 'wide' : 'intrinsic'} tabIndex={illustration ? undefined : 0} aria-label={illustration ? undefined : 'Code example'} onKeyDown={event => {
        onKeyDown?.(event)
        const region = event.currentTarget
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || region.scrollWidth <= region.clientWidth) return
        // Arrow keys retain native scrolling. Home/End expose both ends of
        // a long line without moving the reader to another part of the page.
        if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            region.scrollLeft = event.key === 'Home' ? 0 : region.scrollWidth
        }
    }}>{children}</pre>
}

export default ArticleCode
