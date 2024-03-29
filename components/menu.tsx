import React from 'react'
import { ProjectData } from '../types'

interface MenuProps {
    projects: ProjectData[]
    onSelectProject: (project: ProjectData) => void
}

const Menu: React.FC<MenuProps> = ({ projects, onSelectProject }) => {
    return (
        <ul>
            {projects.map((project) => (
                <li key={project.slug}>
                    <h2>{project.frontMatter.title}</h2>
                    <p>{project.frontMatter.subtitle}</p>
                    <p>{project.frontMatter.description}</p>
                    <button onClick={() => onSelectProject(project)}>View Details</button>
                </li>
            ))}
        </ul>
    )
}

export default Menu