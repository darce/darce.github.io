import React, { ReactNode } from 'react'
import Link from 'next/link'
import styles from './DitheredCard.module.scss'

interface DitheredCardProps {
    href: string
    children: ReactNode
    className?: string
}

/**
 * Card with dithered drop-shadow. Enforces the two-layer DOM required by
 * the effect: transparent outer (owns the ::after dither) and opaque inner
 * (covers the dither within the card bounds so only the offset edge shows).
 *
 * Consumer controls border-color, hover states, and text via `className`.
 */
const DitheredCard: React.FC<DitheredCardProps> = ({ href, children, className }) => {
    const isExternal = href.startsWith('mailto:') || href.startsWith('http')

    if (isExternal) {
        return (
            <a href={href} className={`${styles.outer} ${className || ''}`}>
                <div className={styles.inner}>{children}</div>
            </a>
        )
    }

    return (
        <Link href={href} className={`${styles.outer} ${className || ''}`}>
            <div className={styles.inner}>{children}</div>
        </Link>
    )
}

export default DitheredCard
