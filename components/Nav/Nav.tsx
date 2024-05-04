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
    const [curSection, setCurSection] = useState('0')
    const sections: NavItems[] = [{ loc: '/', label: 'work' }, { loc: 'resume', label: 'resume' }, { loc: 'research', label: 'research' }]

    const handleClick = () => {
    }
    return (
        <nav className={`${styles.nav} ${className || ''}`} aria-label='Daniel Arcé'>
            <ul>
                {sections.map((section) => (
                    <li key={section.label} onClick={() => {
                        router.push(`/${section.loc}`)
                    }}>
                        {section.label}
                    </li>
                )
                )}
            </ul>
        </nav>
    )
}

export default Nav