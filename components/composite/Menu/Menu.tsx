import React from 'react'
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
    return (
        <nav className={`${styles.menu} ${className || ''}`} aria-label={section}>
            <ol className={styles.menuList}>
                {projects.map((project, index) => {
                    const isSelected = selectedProject?.slug === project.slug
                    return (
                        <li key={project.slug + index}
                            className={isSelected ? styles.selected : ''}>
                            <Link
                                href={buildItemPath(section, project.slug)}
                                aria-label={project.metaData.title ?? project.slug}
                                aria-current={isSelected ? 'page' : undefined}
                                onClick={() => onSelectProject?.(project)}
                            >
                                <p className={styles.title}>{project.metaData.title}</p>
                                <p className={styles.subtitle}>{project.metaData.subtitle}</p>
                            </Link>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default Menu
