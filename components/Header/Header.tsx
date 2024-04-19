import React, { useState, useEffect } from 'react'
import Cube from '../Cube/Cube'
import { mapRange } from '../../lib/utils'
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
    const [slant, setSlant] = useState(0)

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove, false)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const handleMouseMove = (event: MouseEvent) => {
        const windowWidth = window.innerWidth
        const mouseX = event.clientX
        const GRADRange = mapRange(mouseX, 0, windowWidth, -200, 150)
        const slantRange = mapRange(mouseX, 0, windowWidth, -10, 0)
        setGRAD(GRADRange)
        setSlant(slantRange)
    }

    return (
        <header className={`${styles.header} ${className || ''}`}>
            <h1 className={styles.title}
                style={{
                    fontVariationSettings: `"GRAD" ${GRAD}, "slnt" ${slant}`
                }}>
                {masthead.title}</h1>
            <h2 className={styles.subtitle}>{masthead.subtitle}</h2>
            <div className={styles.decoration}>
                <Cube />
            </div>
        </header>
    )
}

export default Header