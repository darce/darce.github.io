import React from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import styles from './ThemeToggle.module.scss'

const ThemeToggle: React.FC = () => {
    const { appearance, toggle } = useTheme()
    const isDark = appearance === 'dark'

    return (
        <button
            className={styles.toggle}
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            type="button"
        >
            <span className={styles.grid} aria-hidden="true">
                <span className={styles.c1} />
                <span className={styles.c2} />
                <span className={styles.c3} />
                <span className={styles.c4} />
            </span>
        </button>
    )
}

export default ThemeToggle
