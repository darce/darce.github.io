import React from 'react'
import { ProjectData } from '../types'

interface ProjectDetailsProps {
    project: ProjectData
    onClose: () => void
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
    return (
        <article>
            <h3>{project.frontMatter.title}</h3>
            <p>{project.frontMatter.details}</p>
            <div dangerouslySetInnerHTML={{ __html: project.content }}></div>
            <button onClick={onClose}>Close</button>

        </article>
    )
}
export default ProjectDetails