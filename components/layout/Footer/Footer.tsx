import React from 'react'
import { MarkdownData } from '../../../types'
import { MDXRemote } from 'next-mdx-remote'

interface FooterProps {
    footerData: MarkdownData[]
    className?: string
}
const Footer: React.FC<FooterProps> = ({ footerData, className }) => {
    const footerContent = footerData[0]
    console.log(footerContent)
    return (
        <footer className={`${className || ''}`}>
            <div>
                <MDXRemote {...footerContent.mdxSource} />
            </div>
        </footer>
    )
}

export default Footer