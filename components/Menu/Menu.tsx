import React, { useRef, useEffect } from 'react'
import { MarkdownData } from '../../types'
import styles from './Menu.module.scss'

interface MenuProps {
    projects: MarkdownData[]
    selectedProject: MarkdownData | null
    onSelectProject: (project: MarkdownData) => void
    className?: string
}

const Menu: React.FC<MenuProps> = ({ projects, selectedProject, onSelectProject, className }) => {
    const checkboxRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.checked = true
        }
    }, [])

    const handleClick = (project: MarkdownData) => {
        onSelectProject(project)
        if (checkboxRef.current) {
            checkboxRef.current.checked = false
        }
    }

    return (
        <nav className={`${styles.menu} ${className || ''}`} aria-label='work'>
            <input type="checkbox" id={styles.menuCheckbox} ref={checkboxRef} />
            <label htmlFor={styles.menuCheckbox} className={styles.labelMenuToggle}>
                <div>
                    {'\u2630'}
                </div>
            </label>
            <ol className={styles.navMobile}>
                {projects.map((project, index) => (
                    <li key={project.slug + index}
                        className={project === selectedProject ? styles.selected : ''}
                        onClick={() => handleClick(project)}>
                        <h2 className={styles.title}>{project.frontMatter.title}</h2>
                        <p className={styles.subtitle}>{project.frontMatter.subtitle}</p>
                    </li>
                ))
                }
            </ol >
        </nav>

    )
}

export default Menu