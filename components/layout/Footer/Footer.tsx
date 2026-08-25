import React from 'react'
import { MarkdownData } from '../../../types'
import { MDXRemote } from 'next-mdx-remote'
import styles from './Footer.module.scss'

interface FooterProps {
    footerData: MarkdownData[]
    className?: string
}
const Footer: React.FC<FooterProps> = ({ footerData, className }) => {
    const footerContent = footerData[0]
    if (!footerContent) {
        return null
    }
    return (
        <footer className={`${styles.footer} ${className || ''}`}>
            <div className={styles.footerInner}>
                <MDXRemote {...footerContent.mdxSource} />
            </div>
        </footer>
    )
}

export default Footer
