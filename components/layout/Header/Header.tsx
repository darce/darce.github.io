import React from 'react'
import Link from 'next/link'
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
            <section className={`marquee ${styles.marqueeSection}`}>
                <Link href="/" className={styles.masthead}>
                    <h1 className={styles.title}>
                        {masthead?.title}</h1>
                    <p className={styles.subtitle}
                    >{masthead?.subtitle}</p>
                </Link>

                <section className={styles.decoration} aria-hidden="true">
                    <Cube />
                </section>
            </section>
            <Nav className="nav" />
        </header>
    )
}

export default Header
