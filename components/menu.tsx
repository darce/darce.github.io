import React from 'react'
import { ProjectData } from '../types'

interface MenuProps {
    projects: ProjectData[]
    onSelectProject: (project: ProjectData) => void
    className?: string
}

const Menu: React.FC<MenuProps> = ({ projects, onSelectProject, className }) => {
    return (
        <ol className="menu">
            {projects.map((project, index) => (
                <li key={project.slug + index} onClick={() => onSelectProject(project)}>
                    <h2 className="title">{project.frontMatter.title}</h2>
                    <p className="subtitle">{project.frontMatter.subtitle}</p>
                </li>
            ))
            }
        </ol >
    )
}

export default Menu