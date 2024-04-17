import React from 'react'
import Cube from '../Cube/Cube'
import styles from './Header.module.scss'

interface HeaderProps {
    masthead: {
        title: string,
        subtitle: string
    }
    className?: string
}

const Header: React.FC<HeaderProps> = ({ masthead, className }) => {
    return (
        <header className={`${styles.header} ${className || ''}`}>
            <h1 className={styles.title}>{masthead.title}</h1>
            <h2 className={styles.subtitle}>{masthead.subtitle}</h2>
            <div className={styles.decoration}>
                <Cube />
            </div>
        </header>
    )
}

export default Header