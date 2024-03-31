import React from 'react'
import { ProjectData } from '../types'

interface MenuProps {
    projects: ProjectData[]
    onSelectProject: (project: ProjectData) => void
}

const Menu: React.FC<MenuProps> = ({ projects, onSelectProject }) => {
    return (
        <ol>
            {projects.map((project) => (
                <li key={project.slug} onClick={() => onSelectProject(project)}>
                    <h2>{project.frontMatter.title}</h2>
                    <p>{project.frontMatter.subtitle}</p>
                </li>
            ))}
        </ol>
    )
}

export default Menu