import React from 'react'
import { ContentIndexData } from '../../../types'
import Cube from '../../common/Cube/Cube'
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle'
import Nav from '../../composite/Nav/Nav'
import styles from './Header.module.scss'

interface HeaderProps {
    headerData: ContentIndexData[]
    className?: string
}

const Header: React.FC<HeaderProps> = ({ headerData, className }) => {
    const masthead = headerData[0]?.metaData

    return (
        <header className={`${styles.header} ${className || ''}`}>
            <section className="marquee">
                <div className={styles.masthead}>
                    <h1 className={styles.title}>
                        {masthead?.title}</h1>
                    <p className={styles.subtitle}
                    >{masthead?.subtitle}</p>
                </div>

                <section className={styles.decoration} aria-hidden="true">
                    <Cube />
                </section>
            </section>
            <div className={styles.navRow}>
                <Nav className="nav" />
                <ThemeToggle />
            </div>
        </header>
    )
}

export default Header
