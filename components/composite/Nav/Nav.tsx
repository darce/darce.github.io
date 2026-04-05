import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle'
import styles from './Nav.module.scss'
import { NAV_ITEMS, resolveNavPath } from '../../../lib/routes'
import { useBreadcrumb } from '../../../contexts/BreadcrumbContext'

interface NavProps {
    className?: string
}

const Nav: React.FC<NavProps> = ({ className }) => {
    const router = useRouter()
    const [activePath, setActivePath] = useState(() => resolveNavPath(router.asPath))
    const { title, prev, next } = useBreadcrumb()

    useEffect(() => {
        setActivePath(resolveNavPath(router.asPath))
    }, [router.asPath])

    return (
        <nav className={`${styles.nav} ${className || ''}`} aria-label='Daniel Arcé'>
            <ul>
                {NAV_ITEMS.map((navItem) => (
                    <li
                        key={navItem.label}
                        data-path={navItem.href}
                        className={activePath === navItem.href ? styles.selected : ''}
                    >
                        <Link href={navItem.href} aria-label={navItem.label}>
                            {navItem.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className={styles.themeToggle}>
                <ThemeToggle />
            </div>
            {title && (
                <div className={styles.breadcrumb}>
                    {prev ? (
                        <Link href={prev.href} className={styles.breadcrumbArrow} aria-label={`Previous: ${prev.title}`}>
                            &larr;
                        </Link>
                    ) : (
                        <span className={styles.breadcrumbArrowDisabled} aria-hidden="true">&larr;</span>
                    )}
                    <span className={styles.breadcrumbTitle}>{title}</span>
                    {next ? (
                        <Link href={next.href} className={styles.breadcrumbArrow} aria-label={`Next: ${next.title}`}>
                            &rarr;
                        </Link>
                    ) : (
                        <span className={styles.breadcrumbArrowDisabled} aria-hidden="true">&rarr;</span>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Nav
