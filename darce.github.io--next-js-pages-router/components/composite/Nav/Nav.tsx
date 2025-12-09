import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from './Nav.module.scss'

interface NavProps {
    className?: string
}

interface NavItem {
    loc: string
    label: string
}

const Nav: React.FC<NavProps> = ({ className }) => {
    const router = useRouter()
    const navRef = useRef<HTMLElement>(null)
    const [sliderStyle, setSliderStyle] = useState({})

    const sections: NavItem[] = [
        { loc: '/', label: 'work' },
        { loc: '/research', label: 'research' },
        { loc: '/about', label: 'about' },
    ]

    const updateSliderStyle = () => {
        if (navRef.current) {
            /** Determine which nav item should be highlighted based on current path */
            let dataPathToken: string
            const pathname = router.pathname
            const asPath = router.asPath

            if (pathname === '/' || pathname.startsWith('/projects') || asPath.startsWith('/projects')) {
                // Homepage and project pages map to 'work'
                dataPathToken = '/'
            } else if (pathname.startsWith('/research') || asPath.startsWith('/research')) {
                // Research section pages
                dataPathToken = '/research'
            } else if (pathname === '/[section]/[slug]') {
                // Dynamic section pages - determine from actual path
                if (asPath.startsWith('/projects')) {
                    dataPathToken = '/'
                } else if (asPath.startsWith('/research')) {
                    dataPathToken = '/research'
                } else {
                    dataPathToken = pathname
                }
            } else {
                dataPathToken = pathname
            }
            /** cast element as HTMLElement */
            const activeElement = navRef.current.querySelector(`[data-path="${dataPathToken}"]`) as HTMLElement
            const newStyle = activeElement ?
                {
                    left: activeElement.offsetLeft,
                    width: activeElement.offsetWidth
                } : {}
            setSliderStyle(newStyle)
        }
    }

    /** NavigationAction is passed to both handleClick & handleKeyDown */
    const navigationAction = (section: NavItem) => {
        router.push(section.loc)
    }

    const handleClick = (section: NavItem) => {
        navigationAction(section)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, section: NavItem) => {
        if (event.key === 'Enter') {
            navigationAction(section)
        }
    }

    useEffect(() => {
        updateSliderStyle()
        const handleResize = () => {
            updateSliderStyle()
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [router.pathname, router.asPath])

    return (
        <nav className={`${styles.nav} ${className || ''}`} aria-label='Daniel Arcé' ref={navRef}>
            <ul>
                {sections.map((section) => (
                    <li key={section.label}
                        role="button"
                        aria-label={section.label}
                        data-path={section.loc}
                        tabIndex={0}
                        onClick={() => handleClick(section)}
                        onKeyDown={(event) => handleKeyDown(event, section)}
                    >
                        {section.label}
                    </li>
                )
                )}
                <div className={styles.slider} style={sliderStyle}></div>
            </ul>
        </nav>
    )
}

export default Nav