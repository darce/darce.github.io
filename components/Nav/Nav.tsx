import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Nav.module.scss'

interface NavProps {
    className?: string
}

interface NavItems {
    loc: string
    label: string
}

const Nav: React.FC<NavProps> = ({ className }) => {
    const router = useRouter()
    const [curSection, setCurSection] = useState('/')
    const sections: NavItems[] = [
        { loc: '/', label: 'work' },
        { loc: 'resume', label: 'resume' },
        { loc: 'research', label: 'research' }
    ]

    const handleClick = (section: NavItems) => {
        setCurSection(section.loc)
        router.push(`${section.loc}`)
    }

    return (
        <nav className={`${styles.nav} ${className || ''}`} aria-label='Daniel Arcé'>
            <ul>
                {sections.map((section) => (
                    <li key={section.label}
                        className={curSection === section.loc ? styles.selected : ''}
                        onClick={() => handleClick(section)}>
                        {section.label}
                    </li>
                )
                )}
            </ul>
        </nav>
    )
}

export default Nav