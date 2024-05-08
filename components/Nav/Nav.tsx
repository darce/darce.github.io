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
        { loc: 'resume', label: 'resume' },
        { loc: 'research', label: 'research' }
    ]

    const updateSliderStyle = () => {
        if (navRef.current) {
            /** cast element as HTMLElement */
            const dataPathToken = router.pathname === '/' ? '/' : router.pathname.slice(1)
            const activeElement = navRef.current.querySelector(`[data-path="${dataPathToken}"]`) as HTMLElement
            const newStyle = activeElement ?
                {
                    left: activeElement.offsetLeft,
                    width: activeElement.offsetWidth
                } : {}
            setSliderStyle(newStyle)
        }
    }

    const handleClick = (section: NavItem) => {
        console.log(section)
        router.push(section.loc)
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
    }, [router.pathname])

    return (
        <nav className={`${styles.nav} ${className || ''}`} aria-label='Daniel Arcé' ref={navRef}>
            <ul>
                {sections.map((section) => (
                    <li key={section.label}
                        data-path={section.loc}
                        // className={router.pathname === section.loc ? styles.selected : ''}
                        onClick={() => handleClick(section)}>
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