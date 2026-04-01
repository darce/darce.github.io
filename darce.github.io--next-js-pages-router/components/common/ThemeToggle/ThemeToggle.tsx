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
            <span className={`${styles.icon} ${isDark ? styles.dark : styles.light}`} aria-hidden="true">
                {isDark ? '\u263E' : '\u25CB'}
            </span>
        </button>
    )
}

export default ThemeToggle
