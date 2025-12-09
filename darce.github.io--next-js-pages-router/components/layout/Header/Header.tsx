import React, { useState, useEffect } from 'react'
import { mapRange } from '../../../lib/utils'
import { MarkdownData } from '../../../types'
import Cube from '../../common/Cube/Cube'
import Nav from '../../composite/Nav/Nav'
import styles from './Header.module.scss'

interface HeaderProps {
    headerData: MarkdownData[]
    className?: string
}

const Header: React.FC<HeaderProps> = ({ headerData, className }) => {
    const [GRAD, setGRAD] = useState(0)
    const [wght, setWght] = useState(0)

    const masthead = headerData[0].metaData

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove, false)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const handleMouseMove = (event: MouseEvent) => {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const mouseX = event.clientX
        const mouseY = event.clientY
        const GRADRange = mapRange(mouseY, 0, windowHeight, 150, -200)
        const wghtRange = mapRange(mouseY, 0, windowWidth, 600, 300)
        setGRAD(GRADRange)
        setWght(wghtRange)
    }

    return (
        <header className={`${styles.header} ${className || ''}`}>
            <section className="marquee">
                <div className={styles.masthead}>
                    <h1 className={styles.title}>
                        {masthead.title}</h1>
                    <h2 className={styles.subtitle}
                    >{masthead.subtitle}</h2>
                </div>

                <section className={styles.decoration}>
                    <Cube />
                </section>
            </section>
            <Nav className="nav" />
        </header>
    )
}

export default Header