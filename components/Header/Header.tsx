import React, { useState, useEffect } from 'react'
import { mapRange } from '../../lib/utils'
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
    const [GRAD, setGRAD] = useState(0)
    const [wght, setWght] = useState(0)

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
            <h1 className={styles.title}
                style={{
                    fontVariationSettings: `"GRAD" ${GRAD}, "wght" ${wght}`
                }}>
                {masthead.title}</h1>
            <h2 className={styles.subtitle}

            >{masthead.subtitle}</h2>
            <div className={styles.decoration}>
                <Cube />
            </div>
        </header>
    )
}

export default Header