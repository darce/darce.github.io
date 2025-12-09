import React, { useRef, useEffect } from 'react'
import { MarkdownData } from '../../../types'
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

    /** NavigationAction is passed to both handleClick & handleKeyDown */
    const navigationAction = (project: MarkdownData, toggleCheckbox: boolean = true) => {
        onSelectProject(project)
        if (checkboxRef.current && toggleCheckbox) {
            checkboxRef.current.checked = false
        }
    }

    const handleClick = (project: MarkdownData) => {
        navigationAction(project)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, project: MarkdownData) => {
        if (event.key === 'Enter') {
            navigationAction(project)
        }
    }

    const handleCheckboxKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
        console.log(event)
        if (event.key === 'Enter' && checkboxRef.current) {
            checkboxRef.current.checked = !checkboxRef.current.checked
        }
    }

    return (
        <nav className={`${styles.menu} ${className || ''}`} aria-label='work'>
            <input
                type="checkbox"
                id={styles.menuCheckbox}
                ref={checkboxRef}
                tabIndex={0}
            />
            <label
                htmlFor={styles.menuCheckbox}
                className={styles.labelMenuToggle}
                tabIndex={0}
                aria-label="toggle menu"
                /** event handler on label for a11y */
                onKeyDown={handleCheckboxKeyDown}
            >
                <div>
                    {'\u2630'}
                </div>
            </label>
            <ol className={styles.navMobile}>
                {projects.map((project, index) => {
                    const isSelected = selectedProject?.slug === project.slug
                    return (
                        <li key={project.slug + index}
                            role="button"
                            aria-label={project.metaData.title}
                            tabIndex={0}
                            className={isSelected ? styles.selected : ''}
                            onClick={() => handleClick(project)}
                            onKeyDown={(event) => handleKeyDown(event, project)}>
                            <h3 className={styles.title}>{project.metaData.title}</h3>
                            <p className={styles.subtitle}>{project.metaData.subtitle}</p>
                        </li>
                    )
                })}
            </ol >
        </nav>

    )
}

export default Menu