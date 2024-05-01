import React, { useState, useMemo } from 'react'
import { ProjectData } from '../../types'
import styles from './Menu.module.scss'
import duotone from './Duotone.module.scss'


interface MenuProps {
    projects: ProjectData[]
    onSelectProject: (project: ProjectData) => void
    className?: string
}

const Menu: React.FC<MenuProps> = ({ projects, onSelectProject, className }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [rect, setRect] = useState<DOMRect | null>(null)

    const handleMouseEnter = (e: React.MouseEvent) => {
        /** Capture the bounding rect on mouse enter */
        setRect((e.target as HTMLElement).getBoundingClientRect())
    }
    const handleMouseMove = (e: React.MouseEvent) => {
        // if (rect) {
        //     setPosition({
        //         x: e.clientX - rect.left,
        //         y: e.clientY - rect.top
        //     })
        // }
    }

    return (
        <ol className={`${styles.menu} ${className || ''}`} aria-label='work'>
            {projects.map((project, index) => (
                <li key={project.slug + index}
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