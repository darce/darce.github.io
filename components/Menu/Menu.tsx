import React, { useState, useMemo } from 'react'
import { MarkdownData } from '../../types'
import styles from './Menu.module.scss'

interface MenuProps {
    projects: MarkdownData[]
    selectedProject: MarkdownData | null
    onSelectProject: (project: MarkdownData) => void
    className?: string
}

const Menu: React.FC<MenuProps> = ({ projects, selectedProject, onSelectProject, className }) => {
    return (
        <ol className={`${styles.menu} ${className || ''}`} aria-label='work'>
            {projects.map((project, index) => (
                <li key={project.slug + index}
                    className={project === selectedProject ? styles.selected : ''}
                    onClick={() => onSelectProject(project)}>
                    <h2 className={styles.title}>{project.frontMatter.title}</h2>
                    <p className={styles.subtitle}>{project.frontMatter.subtitle}</p>
                </li>
            ))
            }
        </ol >
    )
}

export default Menu