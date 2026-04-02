import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Nav.module.scss'
import { NAV_ITEMS, resolveNavPath } from '../../../lib/routes'

interface NavProps {
    className?: string
}

interface NavItem {
    href: string
    label: string
}

const Nav: React.FC<NavProps> = ({ className }) => {
    const router = useRouter()
    const navRef = useRef<HTMLElement>(null)
    const [sliderStyle, setSliderStyle] = useState({})
    const [activePath, setActivePath] = useState('/')

    const sections: NavItem[] = NAV_ITEMS

    const updateSliderStyle = () => {
        if (navRef.current) {
            const activeElement = navRef.current.querySelector(`[data-path="${activePath}"]`) as HTMLElement
            const newStyle = activeElement ?
                {
                    left: activeElement.offsetLeft,
                    width: activeElement.offsetWidth
                } : {}
            setSliderStyle(newStyle)
        }
    }

    useEffect(() => {
        setActivePath(resolveNavPath(router.asPath))
        updateSliderStyle()

        const handleResize = () => {
            updateSliderStyle()
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [activePath, router.asPath])

    return (
        <nav className={`${styles.nav} ${className || ''}`} aria-label='Daniel Arcé' ref={navRef}>
            <ul>
                {sections.map((section) => (
                    <li
                        key={section.label}
                        data-path={section.href}
                        className={activePath === section.href ? styles.selected : ''}
                    >
                        <Link href={section.href} aria-label={section.label}>
                            {section.label}
                        </Link>
                    </li>
                ))}
                <div className={styles.slider} style={sliderStyle}></div>
            </ul>
        </nav>
    )
}

export default Nav
