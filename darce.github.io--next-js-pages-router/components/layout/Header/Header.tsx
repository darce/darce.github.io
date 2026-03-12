import React from 'react'
import { ContentIndexData } from '../../../types'
import Cube from '../../common/Cube/Cube'
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
                    <h2 className={styles.subtitle}
                    >{masthead?.subtitle}</h2>
                </div>

                <section className={styles.decoration} aria-hidden="true">
                    <Cube />
                </section>
            </section>
            <Nav className="nav" />
        </header>
    )
}

export default Header
