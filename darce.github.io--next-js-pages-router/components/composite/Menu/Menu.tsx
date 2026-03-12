import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ContentIndexData } from '../../../types'
import styles from './Menu.module.scss'
import { ContentSection, buildItemPath } from '../../../lib/routes'

interface MenuProps {
    section: ContentSection
    projects: ContentIndexData[]
    selectedProject: ContentIndexData | null
    onSelectProject?: (project: ContentIndexData) => void
    className?: string
}

const Menu: React.FC<MenuProps> = ({ section, projects, selectedProject, onSelectProject, className }) => {
    const checkboxRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.checked = true
        }
    }, [])

    const handleCheckboxKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
        if ((event.key === 'Enter' || event.key === ' ') && checkboxRef.current) {
            event.preventDefault()
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
                aria-expanded={checkboxRef.current?.checked ?? false}
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
                            className={isSelected ? styles.selected : ''}>
                            <Link
                                href={buildItemPath(section, project.slug)}
                                aria-label={project.metaData.title ?? project.slug}
                                onClick={() => {
                                    onSelectProject?.(project)
                                    if (checkboxRef.current) {
                                        checkboxRef.current.checked = false
                                    }
                                }}
                            >
                                <h3 className={styles.title}>{project.metaData.title}</h3>
                                <p className={styles.subtitle}>{project.metaData.subtitle}</p>
                            </Link>
                        </li>
                    )
                })}
            </ol >
        </nav>

    )
}

export default Menu
